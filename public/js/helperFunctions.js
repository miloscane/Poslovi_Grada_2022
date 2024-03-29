var podizvodjaci	=	["SeHQZ--1672650353244","IIwY4--1672650358507","TPvkz--1672745311574","e3MHS--1675759749849","eupy8--1676039178890","S5mdP--1677669290493","0ztkS--1672041761145","eexTg--1672041776086","LysTK--1672041750935","ylSnq--1672041756318","KaOzW--1677669275156","QmhV5--1681280323035"];
var radneJedinice	=	["ČUKARICA","RAKOVICA","NOVI BEOGRAD","ZEMUN","ZVEZDARA","VRAČAR","VOŽDOVAC","STARI GRAD","PALILULA","SAVSKI VENAC"];

function getDateAsString(date){
	var yearString	=	date.getFullYear();
	var month		=	eval(date.getMonth()+1);
	var monthString	=	(month<10) ? "0" + month : month;
	var day			=	date.getDate();
	var dayString	=	(day<10) ? "0" + day : day;
	return	dayString+"."+monthString+"."+yearString+".";
}

function reshuffleDate(dateAsString){
	if(dateAsString){
		var array = dateAsString.split("-");
		return array[2]+"."+array[1]+"."+array[0]+".";//dd.mm.yyyyy.
	}else{
		return ""
	}
	
}

function reshuffleDate2(string){//gets DD.MM.YYYY. god.
	var array = string.split("god.")[0].trim().split(".");
	return array[2]+"-"+array[1]+"-"+array[0];//
}

function reshuffleDate3(string){//gets YYYY.MM.DD
	var array = string.split("-");
	return array[2]+"."+array[1]+"."+array[0];//
}

function brojSaRazmacima(x) {
	if(!x){
		return 0
	}
    numberAsString = x.toString().replace(/,/g, " ")
    var parts = numberAsString.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if(parts.length==1){
        parts[1] = "00";
    }else{
        if(parts[1].length==1){
            parts[1]=parts[1]+"0";
        }else if(parts[1].length>2){
        	if(Number(parts[1][2])>5){
        		var lastDigit	=	Number(parts[1][1])+1;
        	}else{
        		var lastDigit	=	Number(parts[1][1])
        	}
        	if(lastDigit==10){
        		parts[1] = eval(Number(parts[1][0])+1).toString() + "0";
        	}else{
        		parts[1] = eval(Number(parts[1][0])).toString() + lastDigit;
        	}
            parts[1]=parts[1][0].toString() + lastDigit;
            //parts[1]=parts[1][0].toString() + parts[1][1].toString();
        }
    }
    return parts.join(",");
}

function getDateAsStringForInputObject(date){
	var yearString	=	date.getFullYear();
	var month		=	eval(date.getMonth()+1);
	var monthString	=	(month<10) ? "0" + month : month;
	var day			=	date.getDate();
	var dayString	=	(day<10) ? "0" + day : day;
	return	yearString+"-"+monthString+"-"+dayString;
}

function vremePrijema(datetime){
	var date 		=	new Date(Number(datetime));
	var yearString	=	date.getFullYear();
	var month		=	eval(date.getMonth()+1);
	var monthString	=	(month<10) ? "0" + month : month;
	var day			=	date.getDate();
	var dayString	=	(day<10) ? "0" + day : day;
	var hour		=	date.getHours();
	var hourString	=	(hour<10) ? "0" + hour : hour;
	var minute		=	date.getMinutes();
	var minuteString=	(minute<10) ? "0" + minute : minute;
	return	dayString+"."+monthString+"."+yearString+". "+hourString+":"+minuteString;
}

function dateTimeToDate(datetime){
	var date 		=	new Date(Number(datetime));
	var yearString	=	date.getFullYear();
	var month		=	eval(date.getMonth()+1);
	var monthString	=	(month<10) ? "0" + month : month;
	var day			=	date.getDate();
	var dayString	=	(day<10) ? "0" + day : day;
	return	dayString+"."+monthString+"."+yearString+".";
}

function dateDifferenceinDays(date2,date1){//Date 2 is end date
	const diffTime = Math.abs(date2 - date1);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
	return diffDays;
}

function msToTime(duration) {
	var milliseconds = Math.floor((duration % 1000) / 100);
	var seconds = Math.floor((duration / 1000) % 60);
	var minutes = Math.floor((duration / (1000 * 60)) % 60);
	var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	//seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes// + ":" + seconds + "." + milliseconds;
}

function msToTime2(duration){
	var h = Math.floor(duration/1000/60/60);
	var m = Math.floor((duration/1000/60/60 - h)*60);
	h = h<10 ? "0"+h : h;
	m = m<10 ? "0"+m : m;
	return h+":"+m;
}

function getMajstorNameFromId(id){
	var name = "Nijedan"
	for(var i=0;i<majstori.length;i++){
		if(majstori[i].uniqueId==id){
			name = majstori[i].ime;
		}
	}
	return name;
}

var definicijeProizvoda = [
										{
											"startCode":"01.01",
											"name":"Pocinkovane Cevi"
										},
										{
											"startCode":"01.02",
											"name":"Pocinkovani Holenderi"
										},
										{
											"startCode":"01.03",
											"name":"Pocinkovani Dupli Nipl"
										},
										{
											"startCode":"01.04",
											"name":"Pocinkovana Kolena"
										},
										{
											"startCode":"01.05",
											"name":"Pocinkovani Muf"
										},
										{
											"startCode":"01.06",
											"name":"Pocinkovani T-Komadi"
										},
										{
											"startCode":"01.07",
											"name":"Pocinkovani T-Komadi-Krst"
										},
										{
											"startCode":"01.08",
											"name":"Čepovi"
										},
										{
											"startCode":"01.09",
											"name":"Pocinkovane redukcije"
										},
										{
											"startCode":"01.10",
											"name":"Kuplung Spojnice"
										},
										{
											"startCode":"01.11",
											"name":"Klizne Spojnice"
										},
										{
											"startCode":"01.12",
											"name":"Kugla ventili"
										},
										{
											"startCode":"01.13",
											"name":"Mesingani Ventili"
										},
										{
											"startCode":"01.14",
											"name":"Virble za propusne ventile"
										},
										{
											"startCode":"01.15",
											"name":"Propsni ventil telo"
										},
										{
											"startCode":"01.16",
											"name":"PPR Cevi"
										},
										{
											"startCode":"01.17",
											"name":"PPR Mufovi"
										},
										{
											"startCode":"01.18",
											"name":"PPR Mufovi SN"
										},
										{
											"startCode":"01.19",
											"name":"PPR Mufovi UN"
										},
										{
											"startCode":"01.20",
											"name":"PPR Kolena SN"
										},
										{
											"startCode":"01.21",
											"name":"PPR Kolena UN"
										},
										{
											"startCode":"01.22",
											"name":"PPR Kolena 90"
										},
										{
											"startCode":"01.23",
											"name":"PPR Kolena 45"
										},
										{
											"startCode":"01.24",
											"name":"PPR Holenderi"
										},
										{
											"startCode":"01.25",
											"name":"PPR T-komadi"
										},
										{
											"startCode":"01.26",
											"name":"PPR Zaobilazni lukovi"
										},
										{
											"startCode":"01.27",
											"name":"PPR Čepovi"
										},
										{
											"startCode":"01.28",
											"name":"Ispitni čepovi"
										},
										{
											"startCode":"01.29",
											"name":"PPR Ventil kape"
										},
										{
											"startCode":"01.30",
											"name":"PPR Ventil Točkovi"
										},
										{
											"startCode":"01.31",
											"name":"PPR Ventil Kugle"
										},
										{
											"startCode":"01.32",
											"name":"PPR Redukcije"
										},
										{
											"startCode":"01.33",
											"name":"PPR Obujmice"
										},
										{
											"startCode":"01.34",
											"name":"PPR redukovani T-Komadi"
										},
										{
											"startCode":"01.35",
											"name":"PP poluspojke"
										},
										{
											"startCode":"01.36",
											"name":"PP spojke"
										},
										{
											"startCode":"01.37",
											"name":"Okiteni"
										},
										{
											"startCode":"01.38",
											"name":"Hidrantske"
										},
										{
											"startCode":"01.39",
											"name":"PP"
										},
										{
											"startCode":"02.01",
											"name":"PVC Cevi"
										},
										{
											"startCode":"02.02",
											"name":"PVC Revizije"
										},
										{
											"startCode":"02.03",
											"name":"LG Prelazi"
										},
										{
											"startCode":"02.04",
											"name":"HL Prelazi"
										},
										{
											"startCode":"02.05",
											"name":"Kermaički prelazi"
										},
										{
											"startCode":"02.06",
											"name":"Prelazne gume"
										},
										{
											"startCode":"02.07",
											"name":"PVC Lukovi 45"
										},
										{
											"startCode":"02.08",
											"name":"PVC Lukovi 90"
										},
										{
											"startCode":"02.09",
											"name":"PVC Redukcije"
										},
										{
											"startCode":"02.10",
											"name":"PVC Račve-T"
										},
										{
											"startCode":"02.11",
											"name":"PVC Kose Račve-T"
										},
										{
											"startCode":"02.12",
											"name":"PVC Dupla Kosa Račva"
										},
										{
											"startCode":"02.13",
											"name":"PVC Klizna Spojka"
										},
										{
											"startCode":"02.14",
											"name":"PVC Slivnici"
										},
										{
											"startCode":"02.15",
											"name":"Šaht poklopci"
										},
										{
											"startCode":"02.16",
											"name":"Gajger Slivnici"
										},
										{
											"startCode":"03.01",
											"name":"Potrošni Materijali"
										},
										{
											"startCode":"03.02",
											"name":"Rezne Ploče"
										},
										{
											"startCode":"04.01",
											"name":"Građevinski materijal 1"
										},
										{
											"startCode":"04.02",
											"name":"Građevinski materijal 2"
										},
										{
											"startCode":"04.03",
											"name":"Građevinski materijal 3"
										}
									]


function loadGif(){
	document.getElementById("load-lightbox").style.display="block";
}
function loadGifStop(){
	document.getElementById("load-lightbox").style.display="none";
}