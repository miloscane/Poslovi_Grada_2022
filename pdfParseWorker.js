const {parentPort}		=	require("worker_threads");
var mongoClient			=	require('mongodb').MongoClient;
var url					=	process.env.mongourl;
var pdfParse			=	require('pdf-parse');
var fs					=	require('fs');

function generateId(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
   return result.join('');
}

function parseData(data){
	var nalogArray	=	data.split("\n");
	var nalogJson	=	{
		rawText: data, 
		uniqueId: generateId(15) +"--"+ new Date().getTime().toString(),
		broj: "",
		narucilac: {
			naziv: "",
			adresa: "",
			pib: "",
			mb: "",
			racun: "",
			osobaZaKontakt: "",
			telefon: ""
		},
		pruzalac: {
			naziv: "",
			adresa: "",
			pib: "",
			mb: "",
			racun: "",
			osobaZaKontakt: "",
			telefon: ""
		},
		adresa: "",
		zahtevalac: "",
		mivrada: {
			code:"",desc:""
		},
		opis:"",
		radnaJedinica: "",
		brojZahteva: "",
		datum:"",
		vrstaRada: "",
		garantniRok: "",
		radUGarantnomRoku: "",
		nalogIzdao:"",
		kontrolniOrgan: "",
		izvodjac: "Premijus DOO",
		partija: "VIK 2023",
		okvirniUgovor: "OP-00016/22",
		okvirniUgovor2: "OP-00016/22-OS",
		rokIzvodjenjaRadova: "2",
		rokPocetkaIzvodjenjaRadova: "ODMAH",
		fakturisanje:[],
		ukupanIznos: "",
		ukupanIznosSlovima: "",
		radIzvrsen: "",
		radPregledan: "",
		izvrseniRadOverava: "",
		radPregledao: "",
		opisRadova: "",
		opisRadovaArr: [],
		opisKvara: "",
		statusNaloga: "Primljen",
		dodeljeniMajstor: "",
		statusOdMajstora: "",
		nalogUStambenom: 0,
		nalogFakturisan: 0,
		datumIspostavljanjaNarudzbenice: ""
	}

	var mbFound= false;
	var racunFound	=	false;
	for(var i=0;i<nalogArray.length;i++){
		var line = nalogArray[i];
		if(nalogArray[i+1]){
			var nextLine	=	nalogArray[i+1];
		}
		//console.log(data);

		//Broj narudzbenice
		if(line.startsWith("N A R U")){
			nalogJson.broj = line.split("br.")[1].trim();
		}
		//Narucilac - Pruzalac
		if(line.startsWith("NAZIV:")){
			nalogJson.narucilac.naziv = line.split("NAZIV:")[1];
			//console.log("Narucilac: " + nalogJson.narucilac.naziv);
			nalogJson.pruzalac.naziv	=	nextLine;
			//console.log("Pruzalac: "+nextLine);
		}
		//Adrese narucioca i pruzioca
		if(line.startsWith("ADRESA")){
			nalogJson.narucilac.adresa	=	line.split("ADRESA")[1];
			//console.log("Adresa narucioca: "+nalogJson.narucilac.adresa);
			nalogJson.pruzalac.adresa	=	line.split("ADRESA")[2];
			//console.log("Adresa pruzaoca: "+nalogJson.pruzalac.adresa);
		}
		//PIB narucioca i pruzaoca
		if(line.startsWith("PIB:")){
			nalogJson.narucilac.pib	=	line.split("PIB:")[1];
			//console.log("PIB narucioca: "+nalogJson.narucilac.pib);
			nalogJson.pruzalac.pib	=	line.split("PIB:")[2];
			//console.log("PIB pruzaoca: "+nalogJson.pruzalac.pib);
		}
		//Maticni Broj narucioca i pruzaoca
		if(line.startsWith("MATIČNI") && !mbFound){
			mbFound	=	true;
			nalogJson.narucilac.mb	=	nalogArray[i+2];
			//console.log("MB narucioca: "+nalogJson.narucilac.mb);
			nalogJson.pruzalac.mb	=	nalogArray[i+5];
			//console.log("MB pruzaoca: "+nalogJson.pruzalac.mb);
		}
		//Brojevi racuna narucioca i pruzaoca
		if(line.startsWith("BROJ RAČUNA") && !racunFound){
			var naruciocBankaLine	=	nalogArray[i+2];
			racunFound	=	true;
			//console.log(naruciocBankaLine);
			if(naruciocBankaLine.startsWith("BROJ RAČUNA")){
				nalogJson.narucilac.racun = " ";
				//console.log("Banka narucioca: ")
				nalogJson.pruzalac.racun = "";
				for(var j=4;j<9;j++){
					if(!nalogArray[i+j].startsWith("OSOBA")){
						nalogJson.pruzalac.racun += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
					}else{
						break;
					}
				}
				//console.log("Banka pruzaoca: " + nalogJson.pruzalac.racun)
			}
		}
		//Osobe za kontakt narucioca i pruzaoca
		if(line.startsWith("OSOBA ZA")){
			nalogJson.narucilac.osobaZaKontakt	=	nalogArray[i+2].split("OSOBA")[0];
			//console.log("Osoba Za Kontakt Narucioca: " + nalogJson.narucilac.osobaZaKontakt)
		}
		//Telefon za narucioca i pruzaoca
		if(line.startsWith("TEL.")){
			nalogJson.narucilac.telefon	=	line.split("TEL./FAKS:")[1];
			//console.log("Telefon za kontakt narucioca: "+nalogJson.narucilac.telefon);
		}

		//Adresa
		if(line.startsWith("Adresa:")){
			nalogJson.adresa	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("Radna jed")){
					nalogJson.adresa += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Adresa: " + nalogJson.adresa)
		}

		//Radna Jedinica
		if(line.startsWith("Radna jed")){
			nalogJson.radnaJedinica	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("Zaht")){
					nalogJson.radnaJedinica += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Radna Jedinica: " + nalogJson.radnaJedinica);
		}

		//Zahtevalac
		if(line.startsWith("Zahtevalac:")){
			nalogJson.zahtevalac	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("Broj zaht")){
					nalogJson.zahtevalac += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Zahtevalac: " + nalogJson.zahtevalac);
		}

		//Broj zahteva
		if(line.startsWith("Broj zahteva:")){
			nalogJson.brojZahteva	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("Datum:")){
					nalogJson.brojZahteva += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Broj Zahteva: " + nalogJson.brojZahteva);
		}

		//Datum
		if(line.startsWith("Datum:")){
			nalogJson.datum	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("Vrsta rada:")){
					nalogJson.datum += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Datum: " + nalogJson.datum);
		}

		//Vrsta Rada
		if(line.startsWith("Vrsta rada:")){
			nalogJson.vrstaRada	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("MiV rada:")){
					nalogJson.vrstaRada += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Vrsta Rada: " + nalogJson.vrstaRada);
		}
		//MiV
		if(line.startsWith("MiV rada:")){
			nalogJson.mivrada.code	=	nextLine;
			nalogJson.mivrada.desc 	=	"";
			for(var j=2;j<5;j++){
				if(!nalogArray[i+j].startsWith("Garantni rok")){
					nalogJson.mivrada.desc += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("MiV rada sifra: " + nalogJson.mivrada.code);
			//console.log("MiV rada opis: " + nalogJson.mivrada.desc);
		}

		//Garantni rok
		if(line.startsWith("Garantni rok")){
			nalogJson.garantniRok	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("Opis")){
					nalogJson.garantniRok += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Garantni Rok: " + nalogJson.garantniRok);
		}

		//Opis
		if(line.startsWith("Opis:")){
			nalogJson.opis		=	"";
			nalogJson.opisKvara	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("Rad")){
					nalogJson.opis += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
					nalogJson.opisKvara += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Opis: " + nalogJson.opis);
		}

		//Opis
		if(line.startsWith("Rad u garantnom")){
			nalogJson.radUGarantnomRoku	=	"";
			for(var j=1;j<5;j++){
				if(!nalogArray[i+j].startsWith("Nalog")){
					nalogJson.radUGarantnomRoku += nalogArray[i+j].replace(/(\r\n|\n|\r)/gm, "");
				}else{
					break;
				}
			}
			//console.log("Rad u garantnom roku: " + nalogJson.radUGarantnomRoku);
		}

		//pokusaj
		if(line.startsWith("NalogizdaoKontrolniorgan")){
			nalogJson.nalogIzdao	=	"";
			nalogJson.kontrolniOrgan=	"";
			if(nextLine.split(nalogJson.narucilac.osobaZaKontakt).length>1){
				nalogJson.kontrolniOrgan = nalogJson.narucilac.osobaZaKontakt;
				nalogJson.nalogIzdao = nextLine.split(nalogJson.narucilac.osobaZaKontakt)[0];
			}
		}

	}
	return nalogJson;
}

parentPort.on("message", pdfFilePath => {
	var pdfFile = fs.readFileSync(pdfFilePath);
	pdfParse(pdfFile).then(function(data) {
		var nalogJson = parseData(data.text);
		fs.unlinkSync(pdfFilePath);
		mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
			if(err){
				console.log(err)
				parentPort.postMessage("Greska!")
			}else{
				client.db(process.env.database).collection('nalozi').find({broj:nalogJson.broj.toString()}).toArray(function(err,nalozi){
					if(err){
						console.log(err)
						parentPort.postMessage("Greska!")
					}else{
						if(nalozi.length>0){
							parentPort.postMessage("double")
						}else{
							client.db(process.env.database).collection('nalozi').insertOne(nalogJson,function(err,addedResult){
								if(err){
									console.log(err);
									parentPort.postMessage("Greska!");
								}else{
									parentPort.postMessage(nalogJson.uniqueId)
								}
								client.close()
							});
						}
					}
				});
			}
		});
		
	}).catch(function(error){
    	console.log(error);
	});
});