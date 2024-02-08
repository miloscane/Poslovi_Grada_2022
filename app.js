//Server
var server				=	require('express')();
var http				=	require('http').Server(server);
var httpl 				=	require('http');
var https 				= 	require('https');
var net					=	require('net');
var express				=	require('express');
var fs					=	require('fs');   
var bodyParser			=	require('body-parser');    
var session				=	require('express-session');
var nodemailer 			=	require('nodemailer');
const dotenv 			=	require('dotenv');
var cookieParser		=	require('cookie-parser');
var crypto				=	require('crypto');
var mongo				=	require('mongodb');
var fileUpload			=	require('express-fileupload');
var multer 				=	require('multer')
var pdfParse			=	require('pdf-parse');
var sharp 				=	require('sharp');
const {Worker,SHARE_ENV}	=	require('worker_threads');
dotenv.config();

server.set('view engine','ejs');
var viewArray	=	[__dirname+'/views'];
var viewFolder	=	fs.readdirSync('views');
for(var i=0;i<viewFolder.length;i++){
	if(viewFolder[i].split(".").length==1){
		viewArray.push(__dirname+'/'+viewFolder[i])
	}
}
server.set('views', viewArray);
//server.use(fileUpload({createParentPath: true}));
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json({limit:'50mb'}));  
server.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));
server.use(cookieParser());
server.use(session({
	secret: process.env.sessionsecret,
    resave: true,
    saveUninitialized: true
}));

var transporter = nodemailer.createTransport({
	host: process.env.transporterhost,
	port: 465,
	secure: true,
	auth: {
		user: process.env.transporteruser,
		pass: process.env.transporterpass
	}
});

var fileStorage	=	multer.diskStorage({
	destination: (req,file,cb)=>{
		cb(null,"./public/uploads");
	},
	filename: (req,file,cb)=>{
		cb(null,Date.now()+"--"+file.originalname)
	}
});
var upload = multer({storage:fileStorage});

function hashString(string){
	if (typeof string === 'string'){
		var hash	=	crypto.createHash('md5').update(string).digest('hex')
	}else{
		var hash    = "?"
	}
	
	return hash
}

var database;
var usersDB;
var pricesDB;
var naloziDB;
var istorijaNalogaDB;
var majstoriDB;
var appRegisterDB;
var magacinProizvodiDB;
var magacinProizvodi2DB;
var magacinProizvodi3DB;
var magacinProizvodi4DB;
var magacinUlazi3DB;
var magacinUlazi4DB;
var magacinReversiDB;
var magacinReversi2DB;
var magacinReversi3DB;
var magacinReversi4DB;
var magacinZaduzenjaDB;
//var komentariStambenoDB;
var izvestajiSaTerenaDB;
var trebovanjaDB;
var prices;

function generateId(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
   return result.join('');
}

/*var pdfFile = fs.readFileSync("./temp/test.pdf");
pdfParse(pdfFile).then(function(data) {
	var nalogJson = parseData(data.text);
	console.log(data.text);
	console.log(nalogJson);
}).catch(function(error){
	console.log(error);
});*/

console.log(process.env.mongourl)

//PORT Listening
http.listen(process.env.PORT, function(){
	mongoClient.connect(url,{useUnifiedTopology: true},function(err,client){
		if(err){
			console.log(err)
		}else{
			database 				=	client;
			pricesDB				=	database.db(process.env.database).collection('Cenovnik');
			usersDB 				=	database.db(process.env.database).collection('Korisnici');
			naloziDB 				=	database.db(process.env.database).collection('nalozi2022');
			istorijaNalogaDB 		=	database.db(process.env.database).collection('istorijaNaloga');
			majstoriDB 				=	database.db(process.env.database).collection('majstori');
			appRegisterDB			=	database.db(process.env.database).collection('registracija-aplikacije');
			magacinProizvodiDB		=	database.db(process.env.database).collection('magacin-proizvodi');
			magacinProizvodi2DB		=	database.db(process.env.database).collection('magacin-proizvodi-2');
			magacinProizvodi3DB		=	database.db(process.env.database).collection('magacin-proizvodi-3');
			magacinProizvodi4DB		=	database.db(process.env.database).collection('magacin-proizvodi-4');
			magacinReversiDB		=	database.db(process.env.database).collection('magacin-reversi');
			magacinReversi2DB		=	database.db(process.env.database).collection('magacin-reversi-2');
			magacinReversi3DB		=	database.db(process.env.database).collection('magacin-reversi-3');
			magacinReversi4DB		=	database.db(process.env.database).collection('magacin-reversi-4');
			magacinInputsDB			=	database.db(process.env.database).collection('magacin-inputs');
			magacinUlazi3DB			=	database.db(process.env.database).collection('magacin-ulazi-3');
			magacinUlazi4DB			=	database.db(process.env.database).collection('magacin-ulazi-4');
			magacinZaduzenjaDB		=	database.db(process.env.database).collection('magacin-zaduzenja');
			//komentariStambenoDB		=	database.db(process.env.database).collection('komentari-stambeno');
			izvestajiSaTerenaDB		=	database.db(process.env.database).collection('izvestaji-sa-terena');
			trebovanjaDB			=	database.db(process.env.database).collection('trebovanja');
			dnevniceDB				=	database.db(process.env.database).collection('Dnevnice');
			ucinakDB				=	database.db(process.env.database).collection('UcinakMajstora');
			console.log("Database Connected...");
			pricesDB.find({}).toArray(function(err,cenovnik){
				if(err){
					console.log(err)
				}else{
					prices = JSON.parse(JSON.stringify(cenovnik))
				}
			});
		}
	});
	console.log('POSLOVI GRADA');
  	console.log('Server Started');
});

var request = require('request');

var premijusHeader = {
    'accept': 'text/plain',
    'ApiKey': process.env.premijuskey,
    'Content-Type': 'application/xml'
};
var premijusDataStrings	=	[];
premijusDataStrings[0]	=	'<Invoice xmlns:cec="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:sbt="http://mfin.gov.rs/srbdt/srbdtext" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"><cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:mfin.gov.rs:srbdt:2021</cbc:CustomizationID><cbc:ID>';
//Broj fakture
premijusDataStrings[1]	=	'</cbc:ID><cbc:IssueDate>';
//datum izdavanja
premijusDataStrings[2]	=	'</cbc:IssueDate><cbc:DueDate>';
//Rok placanja
premijusDataStrings[3]	=	'</cbc:DueDate><cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode><cbc:DocumentCurrencyCode>RSD</cbc:DocumentCurrencyCode><cac:InvoicePeriod><cbc:DescriptionCode>35</cbc:DescriptionCode></cac:InvoicePeriod><cac:OriginatorDocumentReference><cbc:ID>';

premijusDataStrings[16]	=	'</cbc:ID></cac:OriginatorDocumentReference><cac:AccountingSupplierParty><cac:Party><cbc:EndpointID schemeID="9948">110164390</cbc:EndpointID><cac:PartyName><cbc:Name>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>STANKA TIŠME 31 Ђ</cbc:StreetName><cbc:CityName>Beograd (Zemun)          </cbc:CityName><cac:Country><cbc:IdentificationCode>RS</cbc:IdentificationCode></cac:Country></cac:PostalAddress><cac:PartyTaxScheme><cbc:CompanyID>RS110164390</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:RegistrationName><cbc:CompanyID>21309192</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:ElectronicMail>premijusdoo@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cac:Party><cbc:EndpointID schemeID="9948">100373090</cbc:EndpointID><cac:PartyIdentification><cbc:ID>JBKJS:81221</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>ЈАВНО ПРЕДУЗЕЋЕ "ГРАДСКО СТАМБЕНО"</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>ДАНИЈЕЛОВА БР.33</cbc:StreetName><cbc:CityName>БЕОГРАД</cbc:CityName><cbc:PostalZone>11010</cbc:PostalZone><cac:Country><cbc:IdentificationCode>RS</cbc:IdentificationCode></cac:Country></cac:PostalAddress><cac:PartyTaxScheme><cbc:CompanyID>RS100373090</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ЈАВНО ПРЕДУЗЕЋЕ "ГРАДСКО СТАМБЕНО"</cbc:RegistrationName><cbc:CompanyID>07486251</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:ElectronicMail>jpgs@stambeno.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:Delivery><cbc:ActualDeliveryDate>';

//radPregledan
premijusDataStrings[4]	=	'</cbc:ActualDeliveryDate></cac:Delivery><cac:PaymentMeans><cbc:PaymentMeansCode>30</cbc:PaymentMeansCode><cbc:PaymentID>';
//broj fakture
premijusDataStrings[5]	=	'</cbc:PaymentID><cac:PayeeFinancialAccount><cbc:ID>325950070019703417</cbc:ID></cac:PayeeFinancialAccount></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="RSD">';
//iznos poreza
premijusDataStrings[6]	=	'</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="RSD">';
//iznos bez poreza
premijusDataStrings[7]	=	'</cbc:TaxableAmount><cbc:TaxAmount currencyID="RSD">';
//iznos poreza
premijusDataStrings[8]	=	'</cbc:TaxAmount><cac:TaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>20</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="RSD">';
//iznos bez poreza
premijusDataStrings[9]	=	'</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="RSD">';
//iznos bez poreza
premijusDataStrings[10]	=	'</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="RSD">';
//iznos sa porezom
premijusDataStrings[11]	=	'</cbc:TaxInclusiveAmount><cbc:AllowanceTotalAmount currencyID="RSD">0</cbc:AllowanceTotalAmount><cbc:PrepaidAmount currencyID="RSD">0</cbc:PrepaidAmount><cbc:PayableAmount currencyID="RSD">';
//iznos sa porezom
premijusDataStrings[12]	=	'</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="H87">1</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="RSD">';
//iznos bez poreza
premijusDataStrings[13]	=	'</cbc:LineExtensionAmount><cac:Item><cbc:Name>';
//ime stavke
premijusDataStrings[14]	=	'</cbc:Name><cac:ClassifiedTaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>20</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory></cac:Item><cac:Price><cbc:PriceAmount currencyID="RSD">';
//iznos bez poreza
premijusDataStrings[15]	=	'</cbc:PriceAmount></cac:Price></cac:InvoiceLine></Invoice>';



var posloviGradaHeader = {
    'accept': 'text/plain',
    'ApiKey': process.env.poslovigradakey,
    'Content-Type': 'application/xml'
};
var posloviGradaDataStrings	=	[];
posloviGradaDataStrings[0]	=	'<Invoice xmlns:cec="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:sbt="http://mfin.gov.rs/srbdt/srbdtext" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"><cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:mfin.gov.rs:srbdt:2021</cbc:CustomizationID><cbc:ID>';
//Broj fakture
posloviGradaDataStrings[1]	=	'</cbc:ID><cbc:IssueDate>';
//datum izdavanja
posloviGradaDataStrings[2]	=	'</cbc:IssueDate><cbc:DueDate>';
//Rok placanja
//3- datum slanja, 35- datum prometa
posloviGradaDataStrings[3]	=	'</cbc:DueDate><cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode><cbc:DocumentCurrencyCode>RSD</cbc:DocumentCurrencyCode><cac:InvoicePeriod><cbc:DescriptionCode>35</cbc:DescriptionCode></cac:InvoicePeriod><cac:AccountingSupplierParty><cac:Party><cbc:EndpointID schemeID="9948">110424762</cbc:EndpointID><cac:PartyName><cbc:Name>ПОСЛОВИ ГРАДА доо Београд-Палилула</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>Mije Kovačevića 9</cbc:StreetName><cbc:CityName>Beograd (Palilula)</cbc:CityName><cac:Country><cbc:IdentificationCode>RS</cbc:IdentificationCode></cac:Country></cac:PostalAddress><cac:PartyTaxScheme><cbc:CompanyID>RS110424762</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>ПОСЛОВИ ГРАДА доо Београд-Врачар</cbc:RegistrationName><cbc:CompanyID>21348660</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:ElectronicMail>888stefon.jankovic@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cac:Party><cbc:EndpointID schemeID="9948">110164390</cbc:EndpointID><cac:PartyName><cbc:Name>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>STANKA TIŠME 31 Ђ</cbc:StreetName><cbc:CityName>Beograd (Zemun)          </cbc:CityName><cac:Country><cbc:IdentificationCode>RS</cbc:IdentificationCode></cac:Country></cac:PostalAddress><cac:PartyTaxScheme><cbc:CompanyID>RS110164390</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme><cac:PartyLegalEntity><cbc:RegistrationName>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:RegistrationName><cbc:CompanyID>21309192</cbc:CompanyID></cac:PartyLegalEntity><cac:Contact><cbc:ElectronicMail>premijusdoo@gmail.com</cbc:ElectronicMail></cac:Contact></cac:Party></cac:AccountingCustomerParty><cac:Delivery><cbc:ActualDeliveryDate>';
//radPregledan
posloviGradaDataStrings[4]	=	'</cbc:ActualDeliveryDate></cac:Delivery><cac:PaymentMeans><cbc:PaymentMeansCode>30</cbc:PaymentMeansCode><cbc:PaymentID>';
//broj fakture
posloviGradaDataStrings[5]	=	'</cbc:PaymentID><cac:PayeeFinancialAccount><cbc:ID>150000000004353207</cbc:ID></cac:PayeeFinancialAccount></cac:PaymentMeans><cac:TaxTotal><cbc:TaxAmount currencyID="RSD">';
//iznos poreza
posloviGradaDataStrings[6]	=	'</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="RSD">';
//iznos bez poreza
posloviGradaDataStrings[7]	=	'</cbc:TaxableAmount><cbc:TaxAmount currencyID="RSD">';
//iznos poreza
posloviGradaDataStrings[8]	=	'</cbc:TaxAmount><cac:TaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>20</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="RSD">';
//iznos bez poreza
posloviGradaDataStrings[9]	=	'</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="RSD">';
//iznos bez poreza
posloviGradaDataStrings[10]	=	'</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="RSD">';
//iznos sa porezom
posloviGradaDataStrings[11]	=	'</cbc:TaxInclusiveAmount><cbc:AllowanceTotalAmount currencyID="RSD">0</cbc:AllowanceTotalAmount><cbc:PrepaidAmount currencyID="RSD">0</cbc:PrepaidAmount><cbc:PayableAmount currencyID="RSD">';
//iznos sa porezom
posloviGradaDataStrings[12]	=	'</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="H87">1</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="RSD">';
//iznos bez poreza
posloviGradaDataStrings[13]	=	'</cbc:LineExtensionAmount><cac:Item><cbc:Name>';
//ime stavke
posloviGradaDataStrings[14]	=	'</cbc:Name><cac:ClassifiedTaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>20</cbc:Percent><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory></cac:Item><cac:Price><cbc:PriceAmount currencyID="RSD">';
//iznos bez poreza
posloviGradaDataStrings[15]	=	'</cbc:PriceAmount></cac:Price></cac:InvoiceLine></Invoice>';

function generatePremijusUbl(brojFakture,radPregledan,iznos,stavka,ugovor){
	var ubl 	=	premijusDataStrings[0]+brojFakture + premijusDataStrings[1];
	var dateNow			=	new Date();
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var datumIzdavanja	=	yearString+"-"+monthString+"-"+dayString;

	ubl +=	datumIzdavanja +premijusDataStrings[2];
 
	//rok placanja
	dateNow.setDate(dateNow.getDate() + 45);
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var rokPlacanja		=	yearString+"-"+monthString+"-"+dayString;

	if(ugovor){
		ubl +=	rokPlacanja +premijusDataStrings[3]+ugovor+premijusDataStrings[16];
	}else{
		ubl +=	rokPlacanja +premijusDataStrings[3]+"OP-00042/22-OS"+premijusDataStrings[16];
	}
	

	//rad pregledan dolazi kao dd.mm.yyyy
	ubl +=	radPregledan.split(".")[2]+"-"+radPregledan.split(".")[1]+"-"+radPregledan.split(".")[0];
	ubl +=	premijusDataStrings[4] + brojFakture + premijusDataStrings[5];

	var iznosPDVa		=	eval(parseFloat(iznos)*0.2).toFixed(2);
	var iznosBezPDVa  	=	parseFloat(iznos).toFixed(2);
	var ukupanIznos 	=	eval(parseFloat(iznos)+parseFloat(iznosPDVa)).toFixed(2);
	ubl +=	iznosPDVa + premijusDataStrings[6] + iznosBezPDVa + premijusDataStrings[7] + iznosPDVa + premijusDataStrings[8];
	ubl +=	iznosBezPDVa + premijusDataStrings[9] + iznosBezPDVa + premijusDataStrings[10] + ukupanIznos + premijusDataStrings[11];
	ubl +=	ukupanIznos + premijusDataStrings[12] + iznosBezPDVa + premijusDataStrings[13] + stavka + premijusDataStrings[14];
	ubl +=	iznosBezPDVa + premijusDataStrings[15];

	return ubl;
}

function generatePosloviGradaUbl(brojFakture,radPregledan,iznos,stavka){
	var ubl 	=	posloviGradaDataStrings[0]+brojFakture + posloviGradaDataStrings[1];
	var dateNow			=	new Date();
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var datumIzdavanja	=	yearString+"-"+monthString+"-"+dayString;

	ubl +=	datumIzdavanja + posloviGradaDataStrings[2];

	//rok placanja
	dateNow.setDate(dateNow.getDate() + 45);
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var rokPlacanja		=	yearString+"-"+monthString+"-"+dayString;

	ubl +=	rokPlacanja + posloviGradaDataStrings[3];

	//rad pregledan dolazi kao dd.mm.yyyy
	ubl +=	radPregledan.split(".")[2]+"-"+radPregledan.split(".")[1]+"-"+radPregledan.split(".")[0];
	ubl +=	posloviGradaDataStrings[4] + brojFakture + posloviGradaDataStrings[5];

	var iznosPDVa		=	eval(parseFloat(iznos)*0.2).toFixed(2);
	var iznosBezPDVa  	=	parseFloat(iznos).toFixed(2);
	var ukupanIznos 	=	eval(parseFloat(iznos)+parseFloat(iznosPDVa)).toFixed(2);
	ubl +=	iznosPDVa + posloviGradaDataStrings[6] + iznosBezPDVa + posloviGradaDataStrings[7] + iznosPDVa + posloviGradaDataStrings[8];
	ubl +=	iznosBezPDVa + posloviGradaDataStrings[9] + iznosBezPDVa + posloviGradaDataStrings[10] + ukupanIznos + posloviGradaDataStrings[11];
	ubl +=	ukupanIznos + posloviGradaDataStrings[12] + iznosBezPDVa + posloviGradaDataStrings[13] + stavka + posloviGradaDataStrings[14];
	ubl +=	iznosBezPDVa + posloviGradaDataStrings[15];

	return ubl;
}

function generatePGSaPenalom(nalog){
	var dateNow			=	new Date();
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var datumIzdavanja	=	yearString+"-"+monthString+"-"+dayString;
 
	//rok placanja
	dateNow.setDate(dateNow.getDate() + 45);
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var rokPlacanja		=	yearString+"-"+monthString+"-"+dayString;
	var pdv 			=	nalog.pdv ? nalog.pdv : "35";

	var datumIspostavljanjaNarudzbenice = nalog.datumIspostavljanjaNarudzbenice.split(".")[2]+"-"+nalog.datumIspostavljanjaNarudzbenice.split(".")[1]+"-"+nalog.datumIspostavljanjaNarudzbenice.split(".")[0];
	var xml = '<Invoice xmlns:cec="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:sbt="http://mfin.gov.rs/srbdt/srbdtext" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">'+
		      '<cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:mfin.gov.rs:srbdt:2021</cbc:CustomizationID>'+
		      '<cbc:ID>'+nalog.brojFakture+'</cbc:ID>'+
		      '<cbc:IssueDate>'+datumIzdavanja+'</cbc:IssueDate>'+
		      '<cbc:DueDate>'+rokPlacanja+'</cbc:DueDate>'+
		      '<cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>'+
		      '<cbc:DocumentCurrencyCode>RSD</cbc:DocumentCurrencyCode>'+
		      '<cbc:BuyerReference>PORTAL</cbc:BuyerReference>'+
		      '<cac:InvoicePeriod>'+
		        '<cbc:DescriptionCode>'+pdv+'</cbc:DescriptionCode>'+
		      '</cac:InvoicePeriod>'+
		      '<cac:OrderReference>'+
		        '<cbc:ID>'+nalog.broj+'</cbc:ID>'+
		      '</cac:OrderReference>'+
		      '<cac:AccountingSupplierParty>'+
		        '<cac:Party>'+
		          '<cbc:EndpointID schemeID="9948">110424762</cbc:EndpointID>'+//PIB izdavaoca
		          '<cac:PartyName>'+
		            '<cbc:Name>ПОСЛОВИ ГРАДА доо Београд-Палилула</cbc:Name>'+
		          '</cac:PartyName>'+
		          '<cac:PostalAddress>'+//Adresa izdavaoca
		            '<cbc:StreetName>Mije Kovačevića 9</cbc:StreetName>'+
		            '<cbc:CityName>Beograd (Palilula)</cbc:CityName>'+
		            '<cbc:PostalZone>11060</cbc:PostalZone>'+
		            '<cac:Country>'+
		              '<cbc:IdentificationCode>RS</cbc:IdentificationCode>'+
		            '</cac:Country>'+
		          '</cac:PostalAddress>'+
		          '<cac:PartyTaxScheme>'+
		            '<cbc:CompanyID>RS110424762</cbc:CompanyID>'+//PIB izdavaoca
		            '<cac:TaxScheme>'+
		              '<cbc:ID>VAT</cbc:ID>'+
		            '</cac:TaxScheme>'+
		          '</cac:PartyTaxScheme>'+
		          '<cac:PartyLegalEntity>'+
		            '<cbc:RegistrationName>ПОСЛОВИ ГРАДА доо Београд-Палилула</cbc:RegistrationName>'+
		            '<cbc:CompanyID>21348660</cbc:CompanyID>'+//Maticni izdavaoca
		          '</cac:PartyLegalEntity>'+
		          '<cac:Contact>'+
		            '<cbc:ElectronicMail>888stefon.jankovic@gmail.com</cbc:ElectronicMail>'+//Email izdavaoca
		          '</cac:Contact>'+
		        '</cac:Party>'+
		      '</cac:AccountingSupplierParty>'+
		      '<cac:AccountingCustomerParty>'+
		        '<cac:Party>'+
		          '<cbc:EndpointID schemeID="9948">110164390</cbc:EndpointID>'+//PIB primaoca
		          '<cac:PartyName>'+
		            '<cbc:Name>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:Name>'+
		          '</cac:PartyName>'+
		          '<cac:PostalAddress>'+
		            '<cbc:StreetName>STANKA TIŠME 31 Ђ</cbc:StreetName>'+
		            '<cbc:CityName>Beograd (Zemun)          </cbc:CityName>'+
		            '<cac:Country>'+
		              '<cbc:IdentificationCode>RS</cbc:IdentificationCode>'+
		            '</cac:Country>'+
		          '</cac:PostalAddress>'+
		          '<cac:PartyTaxScheme>'+
		            '<cbc:CompanyID>RS110164390</cbc:CompanyID>'+//PIB Primaoca
		            '<cac:TaxScheme>'+
		              '<cbc:ID>VAT</cbc:ID>'+
		            '</cac:TaxScheme>'+
		          '</cac:PartyTaxScheme>'+
		          '<cac:PartyLegalEntity>'+
		            '<cbc:RegistrationName>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:RegistrationName>'+
		            '<cbc:CompanyID>21309192</cbc:CompanyID>'+//Maticni Primaoca
		          '</cac:PartyLegalEntity>'+
		          '<cac:Contact>'+
		            '<cbc:ElectronicMail>premijus.efakture@gmail.com</cbc:ElectronicMail>'+//Email primaoca
		          '</cac:Contact>'+
		        '</cac:Party>'+
		      '</cac:AccountingCustomerParty>'+
		      '<cac:Delivery>'+
		        '<cbc:ActualDeliveryDate>'+datumIspostavljanjaNarudzbenice+'</cbc:ActualDeliveryDate>'+
		      '</cac:Delivery>'+
		      '<cac:PaymentMeans>'+
		        '<cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>'+
		        '<cbc:PaymentID>'+nalog.brojFakture+'</cbc:PaymentID>'+
		        '<cac:PayeeFinancialAccount>'+
		          '<cbc:ID>150000000004353207</cbc:ID>'+//broj racuna IZDAVAOCA
		        '</cac:PayeeFinancialAccount>'+
		      '</cac:PaymentMeans>'+
		      '<cac:TaxTotal>'+
		        '<cbc:TaxAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:TaxAmount>'+
		        '<cac:TaxSubtotal>'+
		          '<cbc:TaxableAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:TaxableAmount>'+
		          '<cbc:TaxAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:TaxAmount>'+
		          '<cac:TaxCategory>'+
		            '<cbc:ID>S</cbc:ID>'+
		            '<cbc:Percent>20</cbc:Percent>'+
		            '<cac:TaxScheme>'+
		              '<cbc:ID>VAT</cbc:ID>'+
		            '</cac:TaxScheme>'+
		          '</cac:TaxCategory>'+
		        '</cac:TaxSubtotal>'+
		        '<cac:TaxSubtotal>'+
		          '<cbc:TaxableAmount currencyID="RSD">-'+eval(parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:TaxableAmount>'+
		          '<cbc:TaxAmount currencyID="RSD">0.00</cbc:TaxAmount>'+
		          '<cac:TaxCategory>'+
		            '<cbc:ID>N</cbc:ID>'+
		            '<cbc:Percent>0</cbc:Percent>'+
		            '<cbc:TaxExemptionReasonCode>PDV-RS-3-DZ</cbc:TaxExemptionReasonCode>'+
		            '<cac:TaxScheme>'+
		              '<cbc:ID>VAT</cbc:ID>'+
		            '</cac:TaxScheme>'+
		          '</cac:TaxCategory>'+
		        '</cac:TaxSubtotal>'+
		      '</cac:TaxTotal>'+
		      '<cac:LegalMonetaryTotal>'+
		        '<cbc:LineExtensionAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)-parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:LineExtensionAmount>'+
		        '<cbc:TaxExclusiveAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)-parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:TaxExclusiveAmount>'+//12400.35
		        '<cbc:TaxInclusiveAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*1.2-parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:TaxInclusiveAmount>'+
		        '<cbc:AllowanceTotalAmount currencyID="RSD">0</cbc:AllowanceTotalAmount>'+
		        '<cbc:PrepaidAmount currencyID="RSD">0</cbc:PrepaidAmount>'+
		        '<cbc:PayableRoundingAmount currencyID="RSD">0</cbc:PayableRoundingAmount>'+
		        '<cbc:PayableAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*1.2-parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:PayableAmount>'+
		      '</cac:LegalMonetaryTotal>'+
		      '<cac:InvoiceLine>'+
		        '<cbc:ID>1</cbc:ID>'+
		        '<cbc:InvoicedQuantity unitCode="H87">1</cbc:InvoicedQuantity>'+
		        '<cbc:LineExtensionAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:LineExtensionAmount>'+
		        '<cac:Item>'+
		          '<cbc:Name>'+'HITNI I NEODLOŽNI RADOVI I TEKUĆE POPRAVKE-VIK RADOVI-'+nalog.adresa+' NARUDŽBENICA BR.'+nalog.broj+'</cbc:Name>'+
		          '<cac:ClassifiedTaxCategory>'+
		            '<cbc:ID>S</cbc:ID>'+
		            '<cbc:Percent>20</cbc:Percent>'+
		            '<cac:TaxScheme>'+
		              '<cbc:ID>VAT</cbc:ID>'+
		            '</cac:TaxScheme>'+
		          '</cac:ClassifiedTaxCategory>'+
		        '</cac:Item>'+
		        '<cac:Price>'+
		          '<cbc:PriceAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:PriceAmount>'+
		        '</cac:Price>'+
		      '</cac:InvoiceLine>'+
		      '<cac:InvoiceLine>'+
		        '<cbc:ID>2</cbc:ID>'+
		        '<cbc:InvoicedQuantity unitCode="H87">-1</cbc:InvoicedQuantity>'+
		        '<cbc:LineExtensionAmount currencyID="RSD">-'+eval(parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:LineExtensionAmount>'+
		        '<cac:Item>'+
		          '<cbc:Name>'+'HITNI I NEODLOŽNI RADOVI I TEKUĆE POPRAVKE-VIK RADOVI-'+nalog.adresa+' NARUDŽBENICA BR. '+nalog.broj+'</cbc:Name>'+
		          '<cac:ClassifiedTaxCategory>'+
		            '<cbc:ID>N</cbc:ID>'+
		            '<cbc:Percent>0</cbc:Percent>'+
		            '<cac:TaxScheme>'+
		              '<cbc:ID>VAT</cbc:ID>'+
		            '</cac:TaxScheme>'+
		          '</cac:ClassifiedTaxCategory>'+
		        '</cac:Item>'+
		        '<cac:Price>'+
		          '<cbc:PriceAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:PriceAmount>'+
		        '</cac:Price>'+
		      '</cac:InvoiceLine>'+
		    '</Invoice>';
		    return xml;
}

function generatePremijusSaPenalom(nalog){
	var dateNow			=	new Date();
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var datumIzdavanja	=	yearString+"-"+monthString+"-"+dayString;
 
	//rok placanja
	dateNow.setDate(dateNow.getDate() + 45);
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var rokPlacanja		=	yearString+"-"+monthString+"-"+dayString;
	var pdv 			=	nalog.pdv ? nalog.pdv : "35";
	var datumIspostavljanjaNarudzbenice = nalog.datumIspostavljanjaNarudzbenice.split(".")[2]+"-"+nalog.datumIspostavljanjaNarudzbenice.split(".")[1]+"-"+nalog.datumIspostavljanjaNarudzbenice.split(".")[0];
	
	var xml 	=	'<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cec="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sbt="http://mfin.gov.rs/srbdt/srbdtext" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
					   '<cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:mfin.gov.rs:srbdt:2021</cbc:CustomizationID>'+
					   '<cbc:ID>'+nalog.brojFakture+'</cbc:ID>'+
					   '<cbc:IssueDate>'+datumIzdavanja+'</cbc:IssueDate>'+
					   '<cbc:DueDate>'+rokPlacanja+'</cbc:DueDate>'+
					   '<cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>'+
					   '<cbc:DocumentCurrencyCode>RSD</cbc:DocumentCurrencyCode>'+
					   '<cbc:BuyerReference>PORTAL</cbc:BuyerReference>'+
					   '<cac:InvoicePeriod>'+
					      '<cbc:DescriptionCode>'+pdv+'</cbc:DescriptionCode>'+
					   '</cac:InvoicePeriod>'+
					   '<cac:OriginatorDocumentReference>'+
					      '<cbc:ID>'+nalog.okvirniUgovor2+'</cbc:ID>'+
					   '</cac:OriginatorDocumentReference>'+
					   '<cac:AccountingSupplierParty>'+
					      '<cac:Party>'+
					         '<cbc:EndpointID schemeID="9948">110164390</cbc:EndpointID>'+
					         '<cac:PartyName>'+
					            '<cbc:Name>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:Name>'+
					         '</cac:PartyName>'+
					         '<cac:PostalAddress>'+
					            '<cbc:StreetName>STANKA TIŠME 31 Ђ</cbc:StreetName>'+
					            '<cbc:CityName>Beograd (Zemun)</cbc:CityName>'+
					            '<cac:Country>'+
					               '<cbc:IdentificationCode>RS</cbc:IdentificationCode>'+
					            '</cac:Country>'+
					         '</cac:PostalAddress>'+
					         '<cac:PartyTaxScheme>'+
					            '<cbc:CompanyID>RS110164390</cbc:CompanyID>'+
					            '<cac:TaxScheme>'+
					               '<cbc:ID>VAT</cbc:ID>'+
					            '</cac:TaxScheme>'+
					         '</cac:PartyTaxScheme>'+
					         '<cac:PartyLegalEntity>'+
					            '<cbc:RegistrationName>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:RegistrationName>'+
					            '<cbc:CompanyID>21309192</cbc:CompanyID>'+
					         '</cac:PartyLegalEntity>'+
					         '<cac:Contact>'+
					            '<cbc:ElectronicMail>premijusdoo@gmail.com</cbc:ElectronicMail>'+
					         '</cac:Contact>'+
					      '</cac:Party>'+
					   '</cac:AccountingSupplierParty>'+
					   '<cac:AccountingCustomerParty>'+
					      '<cac:Party>'+
					         '<cbc:EndpointID schemeID="9948">100373090</cbc:EndpointID>'+
					         '<cac:PartyIdentification>'+
					            '<cbc:ID>JBKJS:81221</cbc:ID>'+
					         '</cac:PartyIdentification>'+
					         '<cac:PartyName>'+
					            '<cbc:Name>ЈАВНО ПРЕДУЗЕЋЕ "ГРАДСКО СТАМБЕНО"</cbc:Name>'+
					         '</cac:PartyName>'+
					         '<cac:PostalAddress>'+
					            '<cbc:StreetName>ДАНИЈЕЛОВА БР.33</cbc:StreetName>'+
					            '<cbc:CityName>БЕОГРАД</cbc:CityName>'+
					            '<cbc:PostalZone>11010</cbc:PostalZone>'+
					            '<cac:Country>'+
					               '<cbc:IdentificationCode>RS</cbc:IdentificationCode>'+
					            '</cac:Country>'+
					         '</cac:PostalAddress>'+
					         '<cac:PartyTaxScheme>'+
					            '<cbc:CompanyID>RS100373090</cbc:CompanyID>'+
					            '<cac:TaxScheme>'+
					               '<cbc:ID>VAT</cbc:ID>'+
					            '</cac:TaxScheme>'+
					         '</cac:PartyTaxScheme>'+
					         '<cac:PartyLegalEntity>'+
					            '<cbc:RegistrationName>ЈАВНО ПРЕДУЗЕЋЕ "ГРАДСКО СТАМБЕНО"</cbc:RegistrationName>'+
					            '<cbc:CompanyID>07486251</cbc:CompanyID>'+
					         '</cac:PartyLegalEntity>'+
					         '<cac:Contact>'+
					            '<cbc:ElectronicMail>jpgs@stambeno.com</cbc:ElectronicMail>'+
					         '</cac:Contact>'+
					      '</cac:Party>'+
					   '</cac:AccountingCustomerParty>'+
					   '<cac:Delivery>'+
					      '<cbc:ActualDeliveryDate>'+datumIspostavljanjaNarudzbenice+'</cbc:ActualDeliveryDate>'+
					   '</cac:Delivery>'+
					   '<cac:PaymentMeans>'+
					      '<cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>'+
					      '<cbc:PaymentID>GS-7285/2023</cbc:PaymentID>'+
					      '<cac:PayeeFinancialAccount>'+
					         '<cbc:ID>325950070019703417</cbc:ID>'+
					      '</cac:PayeeFinancialAccount>'+
					   '</cac:PaymentMeans>'+
					   '<cac:TaxTotal>'+
				        '<cbc:TaxAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:TaxAmount>'+
				        '<cac:TaxSubtotal>'+
				          '<cbc:TaxableAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:TaxableAmount>'+
				          '<cbc:TaxAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:TaxAmount>'+
				          '<cac:TaxCategory>'+
				            '<cbc:ID>S</cbc:ID>'+
				            '<cbc:Percent>20</cbc:Percent>'+
				            '<cac:TaxScheme>'+
				              '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				          '</cac:TaxCategory>'+
				        '</cac:TaxSubtotal>'+
				        '<cac:TaxSubtotal>'+
				          '<cbc:TaxableAmount currencyID="RSD">-'+eval(parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:TaxableAmount>'+
				          '<cbc:TaxAmount currencyID="RSD">0.00</cbc:TaxAmount>'+
				          '<cac:TaxCategory>'+
				            '<cbc:ID>N</cbc:ID>'+
				            '<cbc:Percent>0</cbc:Percent>'+
				            '<cbc:TaxExemptionReasonCode>PDV-RS-3-DZ</cbc:TaxExemptionReasonCode>'+
				            '<cac:TaxScheme>'+
				              '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				          '</cac:TaxCategory>'+
				        '</cac:TaxSubtotal>'+
				      '</cac:TaxTotal>'+
				      '<cac:LegalMonetaryTotal>'+
				        '<cbc:LineExtensionAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)-parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:LineExtensionAmount>'+
				        '<cbc:TaxExclusiveAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)-parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:TaxExclusiveAmount>'+//12400.35
				        '<cbc:TaxInclusiveAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*1.2-parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:TaxInclusiveAmount>'+
				        '<cbc:AllowanceTotalAmount currencyID="RSD">0</cbc:AllowanceTotalAmount>'+
				        '<cbc:PrepaidAmount currencyID="RSD">0</cbc:PrepaidAmount>'+
				        '<cbc:PayableRoundingAmount currencyID="RSD">0</cbc:PayableRoundingAmount>'+
				        '<cbc:PayableAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*1.2-parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:PayableAmount>'+
				      '</cac:LegalMonetaryTotal>'+
				      '<cac:InvoiceLine>'+
				        '<cbc:ID>1</cbc:ID>'+
				        '<cbc:InvoicedQuantity unitCode="H87">1</cbc:InvoicedQuantity>'+
				        '<cbc:LineExtensionAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:LineExtensionAmount>'+
				        '<cac:Item>'+
				          '<cbc:Name>'+'HITNI I NEODLOŽNI RADOVI I TEKUĆE POPRAVKE-VIK RADOVI-'+nalog.adresa+' NARUDŽBENICA BR.'+nalog.broj+'</cbc:Name>'+
				          '<cac:ClassifiedTaxCategory>'+
				            '<cbc:ID>S</cbc:ID>'+
				            '<cbc:Percent>20</cbc:Percent>'+
				            '<cac:TaxScheme>'+
				              '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				          '</cac:ClassifiedTaxCategory>'+
				        '</cac:Item>'+
				        '<cac:Price>'+
				          '<cbc:PriceAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:PriceAmount>'+
				        '</cac:Price>'+
				      '</cac:InvoiceLine>'+
				      '<cac:InvoiceLine>'+
				        '<cbc:ID>2</cbc:ID>'+
				        '<cbc:InvoicedQuantity unitCode="H87">-1</cbc:InvoicedQuantity>'+
				        '<cbc:LineExtensionAmount currencyID="RSD">-'+eval(parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:LineExtensionAmount>'+
				        '<cac:Item>'+
				          '<cbc:Name>'+'HITNI I NEODLOŽNI RADOVI I TEKUĆE POPRAVKE-VIK RADOVI-'+nalog.adresa+' NARUDŽBENICA BR. '+nalog.broj+'</cbc:Name>'+
				          '<cac:ClassifiedTaxCategory>'+
				            '<cbc:ID>N</cbc:ID>'+
				            '<cbc:Percent>0</cbc:Percent>'+
				            '<cac:TaxScheme>'+
				              '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				          '</cac:ClassifiedTaxCategory>'+
				        '</cac:Item>'+
				        '<cac:Price>'+
				          '<cbc:PriceAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*parseFloat(nalog.penal)/100).toFixed(2)+'</cbc:PriceAmount>'+
				        '</cac:Price>'+
				      '</cac:InvoiceLine>'+
				    '</Invoice>';
	return xml;
}

function generatePremijusBezPenala(nalog){
	var dateNow			=	new Date();
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var datumIzdavanja	=	yearString+"-"+monthString+"-"+dayString;
 
	//rok placanja
	dateNow.setDate(dateNow.getDate() + 45);
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var rokPlacanja		=	yearString+"-"+monthString+"-"+dayString;
	var pdv 			=	nalog.pdv ? nalog.pdv : "35";
	var datumIspostavljanjaNarudzbenice = nalog.datumIspostavljanjaNarudzbenice.split(".")[2]+"-"+nalog.datumIspostavljanjaNarudzbenice.split(".")[1]+"-"+nalog.datumIspostavljanjaNarudzbenice.split(".")[0];
	var xml	=	'<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cec="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sbt="http://mfin.gov.rs/srbdt/srbdtext" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
				   '<cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:mfin.gov.rs:srbdt:2021</cbc:CustomizationID>'+
				   '<cbc:ID>'+nalog.brojFakture+'</cbc:ID>'+
				   '<cbc:IssueDate>'+datumIzdavanja+'</cbc:IssueDate>'+
				   '<cbc:DueDate>'+rokPlacanja+'</cbc:DueDate>'+
				   '<cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>'+
				   '<cbc:DocumentCurrencyCode>RSD</cbc:DocumentCurrencyCode>'+
				   '<cbc:BuyerReference>PORTAL</cbc:BuyerReference>'+
				   '<cac:InvoicePeriod>'+
				      '<cbc:DescriptionCode>'+pdv+'</cbc:DescriptionCode>'+
				   '</cac:InvoicePeriod>'+
				   '<cac:OriginatorDocumentReference>'+
				      '<cbc:ID>'+nalog.okvirniUgovor2+'</cbc:ID>'+
				   '</cac:OriginatorDocumentReference>'+
				   '<cac:AccountingSupplierParty>'+
				      '<cac:Party>'+
				         '<cbc:EndpointID schemeID="9948">110164390</cbc:EndpointID>'+
				         '<cac:PartyName>'+
				            '<cbc:Name>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:Name>'+
				         '</cac:PartyName>'+
				         '<cac:PostalAddress>'+
				            '<cbc:StreetName>STANKA TIŠME 31 Ђ</cbc:StreetName>'+
				            '<cbc:CityName>Beograd (Zemun)</cbc:CityName>'+
				            '<cac:Country>'+
				               '<cbc:IdentificationCode>RS</cbc:IdentificationCode>'+
				            '</cac:Country>'+
				         '</cac:PostalAddress>'+
				         '<cac:PartyTaxScheme>'+
				            '<cbc:CompanyID>RS110164390</cbc:CompanyID>'+
				            '<cac:TaxScheme>'+
				               '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				         '</cac:PartyTaxScheme>'+
				         '<cac:PartyLegalEntity>'+
				            '<cbc:RegistrationName>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:RegistrationName>'+
				            '<cbc:CompanyID>21309192</cbc:CompanyID>'+
				         '</cac:PartyLegalEntity>'+
				         '<cac:Contact>'+
				            '<cbc:ElectronicMail>premijusdoo@gmail.com</cbc:ElectronicMail>'+
				         '</cac:Contact>'+
				      '</cac:Party>'+
				   '</cac:AccountingSupplierParty>'+
				   '<cac:AccountingCustomerParty>'+
				      '<cac:Party>'+
				         '<cbc:EndpointID schemeID="9948">100373090</cbc:EndpointID>'+
				         '<cac:PartyIdentification>'+
				            '<cbc:ID>JBKJS:81221</cbc:ID>'+
				         '</cac:PartyIdentification>'+
				         '<cac:PartyName>'+
				            '<cbc:Name>ЈАВНО ПРЕДУЗЕЋЕ "ГРАДСКО СТАМБЕНО"</cbc:Name>'+
				         '</cac:PartyName>'+
				         '<cac:PostalAddress>'+
				            '<cbc:StreetName>ДАНИЈЕЛОВА БР.33</cbc:StreetName>'+
				            '<cbc:CityName>БЕОГРАД</cbc:CityName>'+
				            '<cbc:PostalZone>11010</cbc:PostalZone>'+
				            '<cac:Country>'+
				               '<cbc:IdentificationCode>RS</cbc:IdentificationCode>'+
				            '</cac:Country>'+
				         '</cac:PostalAddress>'+
				         '<cac:PartyTaxScheme>'+
				            '<cbc:CompanyID>RS100373090</cbc:CompanyID>'+
				            '<cac:TaxScheme>'+
				               '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				         '</cac:PartyTaxScheme>'+
				         '<cac:PartyLegalEntity>'+
				            '<cbc:RegistrationName>ЈАВНО ПРЕДУЗЕЋЕ "ГРАДСКО СТАМБЕНО"</cbc:RegistrationName>'+
				            '<cbc:CompanyID>07486251</cbc:CompanyID>'+
				         '</cac:PartyLegalEntity>'+
				         '<cac:Contact>'+
				            '<cbc:ElectronicMail>jpgs@stambeno.com</cbc:ElectronicMail>'+
				         '</cac:Contact>'+
				      '</cac:Party>'+
				   '</cac:AccountingCustomerParty>'+
				   '<cac:Delivery>'+
				      '<cbc:ActualDeliveryDate>'+datumIspostavljanjaNarudzbenice+'</cbc:ActualDeliveryDate>'+
				   '</cac:Delivery>'+
				   '<cac:PaymentMeans>'+
				      '<cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>'+
				      '<cbc:PaymentID>'+nalog.brojFakture+'</cbc:PaymentID>'+
				      '<cac:PayeeFinancialAccount>'+
				         '<cbc:ID>325950070019703417</cbc:ID>'+
				      '</cac:PayeeFinancialAccount>'+
				   '</cac:PaymentMeans>'+
				   '<cac:TaxTotal>'+
				      '<cbc:TaxAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:TaxAmount>'+
				      '<cac:TaxSubtotal>'+
				         '<cbc:TaxableAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:TaxableAmount>'+
				         '<cbc:TaxAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:TaxAmount>'+
				         '<cac:TaxCategory>'+
				            '<cbc:ID>S</cbc:ID>'+
				            '<cbc:Percent>20</cbc:Percent>'+
				            '<cac:TaxScheme>'+
				               '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				         '</cac:TaxCategory>'+
				      '</cac:TaxSubtotal>'+
				   '</cac:TaxTotal>'+
				   '<cac:LegalMonetaryTotal>'+
				      '<cbc:LineExtensionAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:LineExtensionAmount>'+
				      '<cbc:TaxExclusiveAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:TaxExclusiveAmount>'+
				      '<cbc:TaxInclusiveAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*1.2).toFixed(2)+'</cbc:TaxInclusiveAmount>'+
				      '<cbc:AllowanceTotalAmount currencyID="RSD">0</cbc:AllowanceTotalAmount>'+
				      '<cbc:PrepaidAmount currencyID="RSD">0</cbc:PrepaidAmount>'+
				      '<cbc:PayableAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:PayableAmount>'+
				   '</cac:LegalMonetaryTotal>'+
				   '<cac:InvoiceLine>'+
				      '<cbc:ID>1</cbc:ID>'+
				      '<cbc:InvoicedQuantity unitCode="H87">1</cbc:InvoicedQuantity>'+
				      '<cbc:LineExtensionAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:LineExtensionAmount>'+
				      '<cac:Item>'+
				         '<cbc:Name>HITNI I NEODLOŽNI RADOVI I TEKUĆE POPRAVKE-VIK RADOVI-'+nalog.adresa+'-NARUDŽBENICA BR.'+nalog.broj+'</cbc:Name>'+
				         '<cac:ClassifiedTaxCategory>'+
				            '<cbc:ID>S</cbc:ID>'+
				            '<cbc:Percent>20</cbc:Percent>'+
				            '<cac:TaxScheme>'+
				               '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				         '</cac:ClassifiedTaxCategory>'+
				      '</cac:Item>'+
				      '<cac:Price>'+
				         '<cbc:PriceAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:PriceAmount>'+
				      '</cac:Price>'+
				   '</cac:InvoiceLine>'+
				'</Invoice>';
	return xml;
}


function generatePGBezPenala(nalog){
	var dateNow			=	new Date();
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var datumIzdavanja	=	yearString+"-"+monthString+"-"+dayString;
 
	//rok placanja
	dateNow.setDate(dateNow.getDate() + 45);
	var yearString 		=	dateNow.getFullYear();
	var monthString		=	Number(eval(dateNow.getMonth()+1));
	monthString			=	monthString<10 ? "0"+monthString : monthString;
	var dayString		=	Number(dateNow.getDate());
	dayString			=	dayString<10 ? "0"+dayString : dayString;
	var rokPlacanja		=	yearString+"-"+monthString+"-"+dayString;
	var pdv 			=	nalog.pdv ? nalog.pdv : "35";
	var datumIspostavljanjaNarudzbenice = nalog.datumIspostavljanjaNarudzbenice.split(".")[2]+"-"+nalog.datumIspostavljanjaNarudzbenice.split(".")[1]+"-"+nalog.datumIspostavljanjaNarudzbenice.split(".")[0];
	
	var xml	=	'<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cec="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sbt="http://mfin.gov.rs/srbdt/srbdtext" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
				   '<cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:mfin.gov.rs:srbdt:2021</cbc:CustomizationID>'+
				   '<cbc:ID>'+nalog.brojFakture+'</cbc:ID>'+
				   '<cbc:IssueDate>'+datumIzdavanja+'</cbc:IssueDate>'+
				   '<cbc:DueDate>'+rokPlacanje+'</cbc:DueDate>'+
				   '<cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>'+
				   '<cbc:DocumentCurrencyCode>RSD</cbc:DocumentCurrencyCode>'+
				   '<cac:InvoicePeriod>'+
				      '<cbc:DescriptionCode>'+pdv+'</cbc:DescriptionCode>'+
				   '</cac:InvoicePeriod>'+
				   '<cac:AccountingSupplierParty>'+
				      '<cac:Party>'+
				         '<cbc:EndpointID schemeID="9948">110424762</cbc:EndpointID>'+
				         '<cac:PartyName>'+
				            '<cbc:Name>ПОСЛОВИ ГРАДА доо Београд-Палилула</cbc:Name>'+
				         '</cac:PartyName>'+
				         '<cac:PostalAddress>'+
				            '<cbc:StreetName>Mije Kovačevića 9</cbc:StreetName>'+
				            '<cbc:CityName>Beograd (Palilula)</cbc:CityName>'+
				            '<cac:Country>'+
				               '<cbc:IdentificationCode>RS</cbc:IdentificationCode>'+
				            '</cac:Country>'+
				         '</cac:PostalAddress>'+
				         '<cac:PartyTaxScheme>'+
				            '<cbc:CompanyID>RS110424762</cbc:CompanyID>'+
				            '<cac:TaxScheme>'+
				               '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				         '</cac:PartyTaxScheme>'+
				         '<cac:PartyLegalEntity>'+
				            '<cbc:RegistrationName>ПОСЛОВИ ГРАДА доо Београд-Врачар</cbc:RegistrationName>'+
				            '<cbc:CompanyID>21348660</cbc:CompanyID>'+
				         '</cac:PartyLegalEntity>'+
				         '<cac:Contact>'+
				            '<cbc:ElectronicMail>888stefon.jankovic@gmail.com</cbc:ElectronicMail>'+
				         '</cac:Contact>'+
				      '</cac:Party>'+
				   '</cac:AccountingSupplierParty>'+
				   '<cac:AccountingCustomerParty>'+
				      '<cac:Party>'+
				         '<cbc:EndpointID schemeID="9948">110164390</cbc:EndpointID>'+
				         '<cac:PartyName>'+
				            '<cbc:Name>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:Name>'+
				         '</cac:PartyName>'+
				         '<cac:PostalAddress>'+
				            '<cbc:StreetName>STANKA TIŠME 31 Ђ</cbc:StreetName>'+
				            '<cbc:CityName>Beograd (Zemun)</cbc:CityName>'+
				            '<cac:Country>'+
				               '<cbc:IdentificationCode>RS</cbc:IdentificationCode>'+
				            '</cac:Country>'+
				         '</cac:PostalAddress>'+
				         '<cac:PartyTaxScheme>'+
				            '<cbc:CompanyID>RS110164390</cbc:CompanyID>'+
				            '<cac:TaxScheme>'+
				               '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				         '</cac:PartyTaxScheme>'+
				         '<cac:PartyLegalEntity>'+
				            '<cbc:RegistrationName>PREMIJUS D.O.O. BEOGRAD-ZEMUN</cbc:RegistrationName>'+
				            '<cbc:CompanyID>21309192</cbc:CompanyID>'+
				         '</cac:PartyLegalEntity>'+
				         '<cac:Contact>'+
				            '<cbc:ElectronicMail>premijusdoo@gmail.com</cbc:ElectronicMail>'+
				         '</cac:Contact>'+
				      '</cac:Party>'+
				   '</cac:AccountingCustomerParty>'+
				   '<cac:Delivery>'+
				      '<cbc:ActualDeliveryDate>'+datumIspostavljanjaNarudzbenice+'</cbc:ActualDeliveryDate>'+
				   '</cac:Delivery>'+
				   '<cac:PaymentMeans>'+
				      '<cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>'+
				      '<cbc:PaymentID>'+nalog.brojFakture+'</cbc:PaymentID>'+
				      '<cac:PayeeFinancialAccount>'+
				         '<cbc:ID>150000000004353207</cbc:ID>'+
				      '</cac:PayeeFinancialAccount>'+
				   '</cac:PaymentMeans>'+
				   '<cac:TaxTotal>'+
				      '<cbc:TaxAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:TaxAmount>'+
				      '<cac:TaxSubtotal>'+
				         '<cbc:TaxableAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:TaxableAmount>'+
				         '<cbc:TaxAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:TaxAmount>'+
				         '<cac:TaxCategory>'+
				            '<cbc:ID>S</cbc:ID>'+
				            '<cbc:Percent>20</cbc:Percent>'+
				            '<cac:TaxScheme>'+
				               '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				         '</cac:TaxCategory>'+
				      '</cac:TaxSubtotal>'+
				   '</cac:TaxTotal>'+
				   '<cac:LegalMonetaryTotal>'+
				      '<cbc:LineExtensionAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:LineExtensionAmount>'+
				      '<cbc:TaxExclusiveAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:TaxExclusiveAmount>'+
				      '<cbc:TaxInclusiveAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*1.2).toFixed(2)+'</cbc:TaxInclusiveAmount>'+
				      '<cbc:AllowanceTotalAmount currencyID="RSD">0</cbc:AllowanceTotalAmount>'+
				      '<cbc:PrepaidAmount currencyID="RSD">0</cbc:PrepaidAmount>'+
				      '<cbc:PayableAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*0.2).toFixed(2)+'</cbc:PayableAmount>'+
				   '</cac:LegalMonetaryTotal>'+
				   '<cac:InvoiceLine>'+
				      '<cbc:ID>1</cbc:ID>'+
				      '<cbc:InvoicedQuantity unitCode="H87">1</cbc:InvoicedQuantity>'+
				      '<cbc:LineExtensionAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:LineExtensionAmount>'+
				      '<cac:Item>'+
				         '<cbc:Name>HITNI I NEODLOŽNI RADOVI I TEKUĆE POPRAVKE-VIK RADOVI-'+nalog.adresa+'-NARUDŽBENICA BR.'+nalog.broj+'</cbc:Name>'+
				         '<cac:ClassifiedTaxCategory>'+
				            '<cbc:ID>S</cbc:ID>'+
				            '<cbc:Percent>20</cbc:Percent>'+
				            '<cac:TaxScheme>'+
				               '<cbc:ID>VAT</cbc:ID>'+
				            '</cac:TaxScheme>'+
				         '</cac:ClassifiedTaxCategory>'+
				      '</cac:Item>'+
				      '<cac:Price>'+
				         '<cbc:PriceAmount currencyID="RSD">'+parseFloat(nalog.ukupanIznos).toFixed(2)+'</cbc:PriceAmount>'+
				      '</cac:Price>'+
				   '</cac:InvoiceLine>'+
				'</Invoice>';
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


var mongoClient	=	mongo.MongoClient;
var url	=	process.env.mongourl;






server.get('/',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==20){
			res.redirect("/mojiNalozi");
		}else if(Number(req.session.user.role)==10){
			res.redirect("/svi-zavrseni-nalozi");
		}else if(Number(req.session.user.role)==30){
			res.redirect("/podizvodjac");
		}else if(Number(req.session.user.role)==5){
			res.redirect("/premijus/spremni");
		}else if(Number(req.session.user.role)==25){
			res.redirect("/magacin-stanje2");
		}
	}else{
		res.redirect("/login");
	}
});

server.get('/login',async (req,res)=>{
	if(req.session.user){
		res.redirect("/")
	}else{
		res.render("login",{});
	}
}); 

server.post('/login',async (req,res)=>{
	if(!req.session.user){
		var email 		=	req.body.email;
		var password 	=	hashString(req.body.password);
		usersDB.find({email:email}).toArray(async (err,korisnici)=>{
			if(err){
				console.log(err);
				res.send("Greska u bazi podataka 492")
			}else{
				if(korisnici.length>0){
					if(password == korisnici[0].password){
						var sessionObject	=	JSON.parse(JSON.stringify(korisnici[0]));
						delete sessionObject.password;
						req.session.user	=	sessionObject;
						res.redirect("/")
					}else{
						res.send("Pogresna Lozinka.")
					}
				}else{
					res.send("Ne postoji korisnik sa ovom e-mail adresom.");
				}
			}
		});
	}else{
		res.redirect("/");
	}
});

server.get('/logout',async (req,res)=>{
	if(req.session){
		req.session.destroy(function(){});
	}
	res.redirect('/login');
});


server.get('/pdfUpload',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			res.render("pdfUpload",{
				user: req.session.user
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
	
});


server.post('/pdfUpload', upload.single("pdf"), async (req, res) =>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			const worker 		=	new Worker("./pdfParseWorker.js",{ env:SHARE_ENV});
			worker.postMessage(req.file.path);
			worker.on("message",(data)=>{
				if(data=="double"){
					res.render("message",{
						message: "Nalog vec postoji u bazi podataka"
					});
				}else if(data=="Greska!"){
					res.render("message",{
						message: "Greska u bazi podataka"
					});
				}else if(data!="Greska!"){
					res.redirect("/pdfView/"+data);
				} 
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/pdfView/:uniqueId',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			naloziDB.find({uniqueId:req.params.uniqueId.toString()}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					var nalogJson	=	JSON.parse(JSON.stringify(nalozi[0]));
					majstoriDB.find({}).toArray(function(err,majstori){
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							izvestajiSaTerenaDB.find({uniqueId: req.params.uniqueId}).toArray(async (err,izvestaji)=>{
								if(err){
									console.log(err);
									res.send("Greska u bazi podataka");
								}else{
									istorijaNalogaDB.find({uniqueId:req.params.uniqueId}).toArray(async (err,istorija)=>{
										if(err){
											console.log(err)
										}else{
											ucinakDB.find({brojNaloga:nalogJson.broj}).toArray(async (err,ucinci)=>{
												if(err){
													console.log(err);
													res.send("Greska u bazi podataka");
												}else{
													magacinProizvodi3DB.find({}).toArray(async (err,proizvodi)=>{
														if(err){
															console.log(err);
															res.send("Greska u bazi podataka");
														}else{
															magacinReversi4DB.find({nalog:nalogJson.broj}).toArray(async (err,reversi)=>{
																if(err){
																	console.log(err);
																	res.send("Greska u bazi podataka.")
																}else{
																	res.render("pdfView",{
																		nalog: nalogJson,
																		istorija: istorija,
																		cenovnik: prices,
																		majstori: majstori,
																		izvestaji: izvestaji,
																		ucinci: ucinci,
																		proizvodi: proizvodi,
																		reversi: reversi,
																		user: req.session.user
																	});
																}
															});
															
														}
													});
													
												}
											});
										}
									})
									
								}
							})
							
						}
					});
					
				}
			})
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
	
});

server.post('/fakture/:stringdata',async (req,res)=>{
	var receivedString = req.params.stringdata;
	var stringArray	=	receivedString.split("&");
	var naloziToFind	=	[];
	var naloziToSend	=	[];
	for(var i=0;i<stringArray.length;i++){
		var json	=	{};
		json.row	=	stringArray[i].split(":")[0];
		json.nalog	=	stringArray[i].split(":")[1];
		naloziToSend.push(json)
		naloziToFind.push(stringArray[i].split(":")[1])
	}
	naloziDB.find({broj:{$in:naloziToFind}}).toArray(async (err,nalozi)=>{
		if(err){
			console.log(err);
			res.send("Greska 1")
		}else{
			for(var i=0;i<nalozi.length;i++){
				for(var j=0;j<naloziToSend.length;j++){
					if(nalozi[i].broj==naloziToSend[j].nalog){
						naloziToSend[j].brojFakture	=	nalozi[i].brojFakture ? nalozi[i].brojFakture : "NEMA";
						naloziToSend[j].ukupanIznos	=	nalozi[i].ukupanIznos ? nalozi[i].ukupanIznos : "NEMA";
					}
				}
			}
			for(var i=0;i<naloziToSend.length;i++){
				if(naloziToSend[i].brojFakture=="NEMA"){
					naloziToSend.splice(i,1);
					i--;
				}
			}
			var sendString	=	"ODGOVOR#";
			for(var i=0;i<naloziToSend.length;i++){
				sendString 	=	sendString + naloziToSend[i].row+":"+naloziToSend[i].ukupanIznos+":"+naloziToSend[i].brojFakture;
				if(i+1!=naloziToSend.length){
					sendString = sendString + "&"
				}
			}
			if(sendString=="ODGOVOR#"){
				res.send("Nema novih faktura za zadatu pretragu");
			}else{
				res.send(sendString);
			}
		}
	})
	
});

server.post('/nalozi/:stringdata',async (req,res)=>{
	var receivedString	=	req.params.stringdata;
	var stringArray		=	receivedString.split("&");
	var opstina 		=	decodeURIComponent(stringArray[0].split(".")[0]);

	if(opstina=="CUKARICA"){
		opstina = "ČUKARICA";
	}
	if(opstina=="VRACAR"){
		opstina = "VRAČAR";
	}
	if(opstina=="VOZDOVAC"){
		opstina = "VOŽDOVAC";
	}
	var datum			=	stringArray[1].substring(0,stringArray[1].length-3)+"2024";
	naloziDB.find({$and:[{radnaJedinica:opstina},{datum:{$regex:datum}}]}).toArray(async (err,nalozi)=>{
		if(err){
			console.log(err);
			res.send("Greska 1")
		}else{
			var sendString	=	"ODGOVOR#";
			for(var i=0;i<nalozi.length;i++){
				sendString 	=	sendString + nalozi[i].broj+":"+nalozi[i].adresa.split(",")[0];
				if(i+1!=nalozi.length){
					sendString = sendString + "&"
				}
			}
			if(sendString.length=="ODGOVOR#"){
				res.send("Nisu nadjedni nalozi za "+opstina+" na dan "+datum);
			}else{
				res.send(sendString);
			}
			
		}
	})
	
});

server.post('/validirani/:stringdata',async (req,res)=>{
	var receivedString	=	req.params.stringdata;
	var stringArray		=	receivedString.split("&");
	naloziDB.find({broj:{$in:stringArray}}).toArray(async (err,nalozi)=>{
		if(err){
			console.log(err);
			res.send("Greska 1")
		}else{
			var sendString	=	"ODGOVOR#";
			for(var i=0;i<nalozi.length;i++){
				if(nalozi[i].datumValidacije){
					var datumValidacije = nalozi[i].datumValidacije.split("-")[0]+"."+nalozi[i].datumValidacije.split("-")[1]+"."+nalozi[i].datumValidacije.split("-")[2].substring(2,4)+".";
					sendString 	=	sendString + nalozi[i].broj+":"+datumValidacije+":"+nalozi[i].ukupanIznos + "&";	
				}
				
			}
			sendString	=	sendString.slice(0,-1);
			if(sendString.length=="ODGOVOR#"){
				res.send("Nisu nadjedni nalozi za "+opstina+" na dan "+datum);
			}else{
				res.send(sendString);
			}
		}
	})
	
});

server.get('/pdfView/podizvodjac/:uniqueId',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==30){
			naloziDB.find({uniqueId:req.params.uniqueId.toString()}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					var nalogJson	=	JSON.parse(JSON.stringify(nalozi[0]));
					if(nalogJson.majstorNaloga==req.session.user.nalozi){
							izvestajiSaTerenaDB.find({uniqueId: req.params.uniqueId}).toArray(async (err,izvestaji)=>{
								if(err){
									console.log(err);
									res.send("Greska u bazi podataka");
								}else{
									//var notAllowed	=	["Nalog u Stambenom","Spreman za fakturisanje","Fakturisan"];
									//if(notAllowed.indexOf(nalogJson.statusNaloga)>=0){
										//res.send("Nalog je u stambenom ili je fakturisan pa ne smete menjati ovaj nalog dok je u ovom procesu.");
									//}else{
										res.render("pdfViewPodizvodjac",{
											nalog: nalogJson,
											cenovnik: prices,
											izvestaji: izvestaji,
											user: req.session.user
										});
									//}
									
								}
							})
					}else{
						res.redirect("/")
					}
				}
			})
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
	
});

/*server.get('/pdfView/outside/:uniqueId',async (req,res)=>{
	naloziDB.find({uniqueId:req.params.uniqueId.toString()}).toArray(async (err,nalozi)=>{
		if(err){
			console.log(err);
			res.send("Greska u bazi podataka");
		}else{
			if(nalozi.length>0){
				var nalogJson	=	JSON.parse(JSON.stringify(nalozi[0]));
				komentariStambenoDB.find({uniqueId:nalogJson.uniqueId}).toArray(async (err,komentariStambeno)=>{
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						izvestajiSaTerenaDB.find({uniqueId: req.params.uniqueId}).toArray(async (err,izvestaji)=>{
							if(err){
								console.log(err);
								res.send("Greska u bazi podataka")
							}else{
								res.render("pdfViewOutside",{
									nalog: nalogJson,
									izvestaji: izvestaji,
									komentariStambeno: komentariStambeno
								});
							}
						});
						
					}
				});
			}else{
				res.render("messageOutside",{
					message: "Nalog pod brojem "+req.body.brojnaloga+" nije u bazi podataka. Kliknite <a href=\"/nadji-nalog\" style=\"color:rgb(32,51,100);text-decoration:underline;font-weight:600\">ovde</a> za povratak na pretragu."
				});
			}
			
			
		}
	})
});*/

server.get('/pdfView/premijus/:uniqueId',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==5){
			naloziDB.find({uniqueId:req.params.uniqueId.toString()}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					var nalogJson	=	JSON.parse(JSON.stringify(nalozi[0]));
					res.render("pdfViewPremijus",{
						nalog: nalogJson,
						cenovnik: prices,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.get('/specifikacije',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			naloziDB.find({brojSpecifikacije:{$nin:["",null]}}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("specifikacije",{
						nalozi: nalozi,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.get('/specifikacije/:radnaJedinica',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			naloziDB.find({radnaJedinica:decodeURIComponent(req.params.radnaJedinica)}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("grupnaSpecifikacija",{
						nalozi: nalozi,
						radnaJedinica: decodeURIComponent(req.params.radnaJedinica),
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.get('/specifikacija/:brojSpecifikacije',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			naloziDB.find({brojSpecifikacije:decodeURIComponent(req.params.brojSpecifikacije)}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("specifikacija",{
						nalozi: nalozi,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});




server.get('/isfakturisaniNalozi',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			naloziDB.find({brojFakture:{$nin:["",null]},statusNaloga:"Fakturisan"}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("isfakturisaniNalozi",{
						nalozi: nalozi,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});




server.get('/naloziPoMajstoru',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			majstoriDB.find({}).toArray(async (err,majstori)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					naloziDB.find({statusNaloga:{$nin: ["Završeno","Nalog u Stambenom","Spreman za fakturisanje","Fakturisan"]}}).toArray(function(err,nalozi){
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							var uniqueIds = [];
							for(var i=0;i<nalozi.length;i++){
								uniqueIds.push(nalozi[i].uniqueId)
							}
							izvestajiSaTerenaDB.find({uniqueId: {$in:uniqueIds}}).toArray(async (err,izvestaji)=>{
								if(err){
									console.log(err)
									res.send("Greska u bazi podataka");
								}else{
									res.render("naloziPoMajstoru",{
										nalozi: nalozi,
										majstori: majstori,
										izvestaji: izvestaji,
										user: req.session.user
									});
								}
							});
						}
					});
				}
			});
			
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.get('/ucinakPoMajstoruForm',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			res.render("ucinakPoMajstoruForm",{
				user: req.session.user
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.post('/ucinakPoMajstoru',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			var json = JSON.parse(req.body.json);
			var starttime	=	Number(json.od);
			var endtime 	=	Number(json.do);
			naloziDB.find({statusNaloga:{$in: ["Završeno","Nalog u Stambenom","Fakturisan","Spreman za fakturisanje"]}}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");	
				}else{
					var naloziToShow	=	[];
					for(var i=0;i<nalozi.length;i++){
						if(nalozi[i].hasOwnProperty("datumUcinka")){
							if(nalozi[i].datumUcinka==null ){
								nalozi[i].datumUcinka = 1691074091538;
							}
						}
						
						if(!isNaN(Number(nalozi[i].datumUcinka))){
							var nalogTime = Number(nalozi[i].datumUcinka);
							if(nalogTime>=starttime && nalogTime<=endtime){
								naloziToShow.push(nalozi[i]);
							}	
						}
					}
					majstoriDB.find({}).toArray(async (err,majstori)=>{
						if(err){
							console.log(err)
						}else{
							res.render("ucinakPoMajstoru",{
								nalozi: naloziToShow,
								period: json,
								majstori: majstori,
								user: req.session.user
							})
						}
					});
					
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.get('/ucinakPoPodizvodjacuForm',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			res.render("ucinakPoPodizvodjacuForm",{
				user: req.session.user
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.post('/ucinakPoPodizvodjacu',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			var json = JSON.parse(req.body.json);
			var starttime	=	Number(json.od);
			var endtime 	=	Number(json.do);
			majstoriDB.find({}).toArray(async (err,majstori)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					var majstoriIds	=	[];
					for(var i=0;i<majstori.length;i++){
						majstoriIds.push(majstori[i].uniqueId);
					}
					naloziDB.find({majstorNaloga:{$in: majstoriIds}}).toArray(async (err,nalozi)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");	
						}else{
							var naloziToShow	=	[]
							for(var i=0;i<nalozi.length;i++){
								var nalogTime = Number(nalozi[i].uniqueId.split("--")[1]);
								if(nalogTime>=starttime && nalogTime<=endtime){
									naloziToShow.push(nalozi[i]);
								}
							}
							res.render("ucinakPoPodizvodjacu",{
								majstori: majstori,
								nalozi: naloziToShow,
								period: json,
								user: req.session.user
							})
						}
					})
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.get('/skidanjeIznosaNalogaForm',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			res.render("skidanjeIznosaNalogaForm",{
				user: req.session.user
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.post('/skidanjeIznosaNaloga',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			var json = JSON.parse(req.body.json);
			var starttime	=	Number(json.od);
			var endtime 	=	Number(json.do);
			var majstoriIds	=	[];
			for(var i=0;i<majstori.length;i++){
				majstoriIds.push(majstori[i].uniqueId);
			}
			naloziDB.aggregate({}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");	
				}else{
					var naloziToShow	=	[]
					for(var i=0;i<nalozi.length;i++){
						var nalogTime = Number(nalozi[i].uniqueId.split("--")[1]);
						if(nalogTime>=starttime && nalogTime<=endtime){
							naloziToShow.push(nalozi[i]);
						}
					}
					res.render("skidanjeIznosaNaloga",{
						nalozi: naloziToShow,
						period: json,
						user: req.session.user
					})
				}
			})
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});


server.post('/editNalog',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			var nalogJson = JSON.parse(req.body.nalogjson);
			if(Number(req.session.user.role)==10){
				/*if(Number(nalogJson.fakturisan)==1){
					//Ne menjaj status i iznos i fakturisanje, pdv i penal itd
					var setObj	=	{ $set: {
								datumOdlaganja: 					nalogJson.datumOdlaganja,
								razlogOdlaganja: 					nalogJson.razlogOdlaganja,
								statusOdMajstora: 					nalogJson.statusOdMajstora,
								majstorNaloga: 						nalogJson.majstorNaloga,
								opisKvara: 							nalogJson.opisKvara,
								opisRadova: 						nalogJson.opisRadova,
								opisRadovaArr: 						nalogJson.opisRadovaArr,
								radIzvrsen: 						nalogJson.radIzvrsen,
								izvrseniRadOverava: 				nalogJson.izvrseniRadOverava,
								radPregledao: 						nalogJson.radPregledao,
								iznosPrePotpisa: 					nalogJson.iznosPrePotpisa,
								brojSpecifikacije: 					nalogJson.brojSpecifikacije,	
								datumiDodeljivanja: 				nalogJson.datumiDodeljivanja,
								//istorija: 							nalogJson.istorija,
								datumUcinka: 						nalogJson.datumUcinka,
								majstorUcinak: 						nalogJson.majstorUcinak
							}};	

				}else{*/
					var setObj	=	{ $set: {
								datumOdlaganja: 					nalogJson.datumOdlaganja,
								razlogOdlaganja: 					nalogJson.razlogOdlaganja,
								statusNaloga: 						nalogJson.statusNaloga,
								statusOdMajstora: 					nalogJson.statusOdMajstora,
								majstorNaloga: 						nalogJson.majstorNaloga,
								opisKvara: 							nalogJson.opisKvara,
								opisRadova: 						nalogJson.opisRadova,
								opisRadovaArr: 						nalogJson.opisRadovaArr,
								opisRadovaUvod: 					nalogJson.opisRadovaUvod,
								opisRadovaRazrada: 					nalogJson.opisRadovaRazrada,
								opisRadovaZakljucak: 				nalogJson.opisRadovaZakljucak,
								fakturisanje: 						nalogJson.fakturisanje,
								ukupanIznosSlovima: 				nalogJson.ukupanIznosSlovima,
								ukupanIznos: 						nalogJson.ukupanIznos,
								radIzvrsen: 						nalogJson.radIzvrsen,
								radPregledan: 						nalogJson.radPregledan,
								izvrseniRadOverava: 				nalogJson.izvrseniRadOverava,
								radPregledao: 						nalogJson.radPregledao,
								iznosPrePotpisa: 					nalogJson.iznosPrePotpisa,
								datumIspostavljanjaNarudzbenice: 	nalogJson.datumIspostavljanjaNarudzbenice,
								brojSpecifikacije: 					nalogJson.brojSpecifikacije,
								pdv: 								nalogJson.pdv,
								penal:								nalogJson.penal,	
								datumiDodeljivanja: 				nalogJson.datumiDodeljivanja,
								//istorija: 							nalogJson.istorija,
								datumUcinka: 						nalogJson.datumUcinka,
								majstorUcinak: 						nalogJson.majstorUcinak
							}};
				//}
				
			}else if(Number(req.session.user.role)==20){
				var setObj	=	{ $set: {
								datumOdlaganja: 					nalogJson.datumOdlaganja,
								razlogOdlaganja: 					nalogJson.razlogOdlaganja,
								statusNaloga: 						nalogJson.statusNaloga,
								statusOdMajstora: 					nalogJson.statusOdMajstora,
								majstorNaloga: 						nalogJson.majstorNaloga,
								opisKvara: 							nalogJson.opisKvara,
								opisRadova: 						nalogJson.opisRadova,
								opisRadovaArr: 						nalogJson.opisRadovaArr,
								opisRadovaUvod: 					nalogJson.opisRadovaUvod,
								opisRadovaRazrada: 					nalogJson.opisRadovaRazrada,
								opisRadovaZakljucak: 				nalogJson.opisRadovaZakljucak,
								fakturisanje: 						nalogJson.fakturisanje,
								ukupanIznosSlovima: 				nalogJson.ukupanIznosSlovima,
								ukupanIznos: 						nalogJson.ukupanIznos,
								radIzvrsen: 						nalogJson.radIzvrsen,
								radPregledan: 						nalogJson.radPregledan,
								izvrseniRadOverava: 				nalogJson.izvrseniRadOverava,
								radPregledao: 						nalogJson.radPregledao,
								iznosPrePotpisa: 					nalogJson.iznosPrePotpisa,
								datumIspostavljanjaNarudzbenice: 	nalogJson.datumIspostavljanjaNarudzbenice,
								brojSpecifikacije: 					nalogJson.brojSpecifikacije,
								datumiDodeljivanja: 				nalogJson.datumiDodeljivanja,
								datumZakazivanja: 					nalogJson.datumZakazivanja,
								vremeZakazivanja: 					nalogJson.vremeZakazivanja
							}};
			}
			
			naloziDB.updateOne({uniqueId:nalogJson.uniqueId},setObj, (err , collection) => {
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					istorijaNalogaDB.insertOne(nalogJson.istorija,async (err,addedResult)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							if(req.session.user.role=="20"){
								res.redirect("/mojiNalozi");
							}else{
								res.redirect("/svi-zavrseni-nalozi");
							}
						}
					});
					
					
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.post('/editNalogPodizvodjac',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==30){
			var nalogJson = JSON.parse(req.body.nalogjson);
			var sendMail	=	nalogJson.sendMail ? 1 : 0;
			delete nalogJson.sendMail;
			var setObj	=	{ $set: {
								datumOdlaganja: 					nalogJson.datumOdlaganja,
								razlogOdlaganja: 					nalogJson.razlogOdlaganja,
								statusNaloga: 						nalogJson.statusNaloga,
								statusOdMajstora: 					nalogJson.statusOdMajstora,
								opisKvara: 							nalogJson.opisKvara,
								opisRadova: 						nalogJson.opisRadova,
								opisRadovaArr: 						nalogJson.opisRadovaArr,
								fakturisanje: 						nalogJson.fakturisanje,
								ukupanIznosSlovima: 				nalogJson.ukupanIznosSlovima,
								ukupanIznos: 						nalogJson.ukupanIznos,
								radIzvrsen: 						nalogJson.radIzvrsen,
								radPregledan: 						nalogJson.radPregledan,
								izvrseniRadOverava: 				nalogJson.izvrseniRadOverava,
								radPregledao: 						nalogJson.radPregledao,
								iznosPrePotpisa: 					nalogJson.iznosPrePotpisa,
								datumIspostavljanjaNarudzbenice: 	nalogJson.datumIspostavljanjaNarudzbenice
								//istorija: 							nalogJson.istorija

							}};
			naloziDB.updateOne({uniqueId:nalogJson.uniqueId},setObj, (err , collection) => {
				if(err){
					console.log(err);
					console.log("Greska u bazi podataka")
				}else{
					istorijaNalogaDB.insertOne(nalogJson.istorija,async (err,addedResult)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							res.redirect("/pdfView/podizvodjac/"+nalogJson.uniqueId);
						}
					});
					
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.post('/editNalogPremijus',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==5){
			var nalogJson = JSON.parse(req.body.nalogjson);
			var setObj	=	{ $set: {
								statusNaloga: 						nalogJson.statusNaloga,
								fakturisanje: 						nalogJson.fakturisanje,
								ukupanIznosSlovima: 				nalogJson.ukupanIznosSlovima,
								ukupanIznos: 						nalogJson.ukupanIznos,
								radIzvrsen: 						nalogJson.radIzvrsen,
								radPregledan: 						nalogJson.radPregledan,
								izvrseniRadOverava: 				nalogJson.izvrseniRadOverava,
								radPregledao: 						nalogJson.radPregledao,
								datumIspostavljanjaNarudzbenice: 	nalogJson.datumIspostavljanjaNarudzbenice,
								okvirniUgovor: 						nalogJson.okvirniUgovor,
								okvirniUgovor2: 					nalogJson.okvirniUgovor2, 
								pdv: 								nalogJson.pdv,
								penal:								nalogJson.penal,			  	
								brojFakture: 						nalogJson.brojFakture

							}};
			naloziDB.updateOne({uniqueId:nalogJson.uniqueId},setObj, (err , collection) => {
				if(err){
					console.log(err);
					console.log("Greska u bazi podataka")
				}else{
					res.redirect("/pdfView/premijus/"+nalogJson.uniqueId);
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});


server.post('/podizvodjacOdlaganje',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==30){
			var odlaganjeJson = JSON.parse(req.body.json);
			var setObj	=	{ $set: {
								datumOdlaganja: 					odlaganjeJson.datumOdlaganja,
								razlogOdlaganja: 					odlaganjeJson.razlogOdlaganja

							}};
			naloziDB.updateOne({uniqueId:odlaganjeJson.uniqueId},setObj, (err , collection) => {
				if(err){
					console.log(err);
					console.log("Greska u bazi podataka")
				}else{
					majstoriDB.find({uniqueId:odlaganjeJson.majstor}).toArray(async (err,majstori)=>{
						if(err){
							console.log(err)
						}else{
							var mejlovi = ["aleksandar.varagic@poslovigrada.rs","odlaganjeroka@poslovigrada.rs","jeca.obradovic@poslovigrada.rs","mirjana.korac@poslovigrada.rs"];
							for(var i=0;i<majstori.length;i++){
								mejlovi.push(majstori[i].mail)
							}
							var mailOptions = {
								from: '"Portal Poslovi Grada" <admin@poslovigrada.rs>',
								to: mejlovi.join(","),
								subject: 'Poslovi Grada: '+odlaganjeJson.opstina+', odlaganje roka po nalogu broj:' +odlaganjeJson.brojNaloga,
								html: 'Novi zahtev za odlaganje roka za:<br><b>Broj naloga:</b> '+odlaganjeJson.brojNaloga+'<br><b>Opstina: </b>'+odlaganjeJson.opstina+'<br><b>Adresa: </b>'+odlaganjeJson.adresa+'<br><b>Datum odlaganja: </b>'+odlaganjeJson.datumOdlaganja+'<br><b>Razlog odlaganja: </b>'+odlaganjeJson.razlogOdlaganja+'<br>&nbsp;<br>Portal Poslova Grada'
							};
								
							transporter.sendMail(mailOptions, (error, info) => {
								if (error) {
									return console.log(error);
								}
								res.redirect("/pdfView/podizvodjac/"+odlaganjeJson.uniqueId);
							});
						}
					})

					
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

/*server.post('/fakturaPremijus',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==5){
			var nalogJson = JSON.parse(req.body.nalogjson);
			var setObj	=	{ $set: {
								statusNaloga: 						"Fakturisan",
								fakturisanje: 						nalogJson.fakturisanje,
								ukupanIznosSlovima: 				nalogJson.ukupanIznosSlovima,
								ukupanIznos: 						nalogJson.ukupanIznos,
								radIzvrsen: 						nalogJson.radIzvrsen,
								radPregledan: 						nalogJson.radPregledan,
								izvrseniRadOverava: 				nalogJson.izvrseniRadOverava,
								radPregledao: 						nalogJson.radPregledao,
								datumIspostavljanjaNarudzbenice: 	nalogJson.datumIspostavljanjaNarudzbenice,
								okvirniUgovor: 						nalogJson.okvirniUgovor,
								okvirniUgovor2: 					nalogJson.okvirniUgovor2, 	
								brojFakture: 						nalogJson.brojFakture
							}};
			naloziDB.updateOne({uniqueId:nalogJson.uniqueId},setObj, (err , collection) => {
				if(err){
					console.log(err);
					console.log("Greska u bazi podataka")
				}else{
					var options = {
					    url: 'https://efaktura.mfin.gov.rs/api/publicApi/sales-invoice/ubl?requestId='+new Date().getTime()+'&sendToCir=No',
					    method: 'POST',
					    headers: premijusHeader,
					    body: generatePremijusUbl(nalogJson.brojFakture,nalogJson.radPregledan,nalogJson.ukupanIznos,"HITNI I NEODLOŽNI RADOVI I TEKUĆE POPRAVKE-VIK RADOVI-"+nalogJson.adresa+"-"+"NARUDŽBENICA BR."+nalogJson.broj,nalogJson.okvirniUgovor2)
					};
					request(options, (error,response,body)=>{
						if(error){
							console.log(error)
						}
						var responseBody	=	{};
						try{
							responseBody	=	JSON.parse(response.body);
						}catch(err){
							console.log(err)
							var responseBody	=	{};
						}
						var messagePremijus;
						if(responseBody.InvoiceId){
							messagePremijus	=	"PREMIJUS: Faktura uspesno postavljena u SEF."
						}else{
							messagePremijus = "PREMIJUS: Status naloga je promenjen u \"Fakturisan\" ALIII doslo je do problema sa eFakturom: <br>"+JSON.stringify(response.body)+ "<br><div class=\"button\" style=\"padding:0\"><a style=\"display:block;padding:6px 24px\" href=\"/pdfView/premijus/"+nalogJson.uniqueId+"\">Povratak na nalog</a>";
						}
						res.render('messagePremijus',{
							user: req.session.user,
							message: messagePremijus
						});

						
					})
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});*/

server.post('/fakturaPremijus',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==5){
			var nalogJson = JSON.parse(req.body.nalogjson);
			var setObj	=	{ $set: {
								statusNaloga: 						nalogJson.statusNaloga,
								fakturisanje: 						nalogJson.fakturisanje,
								ukupanIznosSlovima: 				nalogJson.ukupanIznosSlovima,
								ukupanIznos: 						nalogJson.ukupanIznos,
								radIzvrsen: 						nalogJson.radIzvrsen,
								radPregledan: 						nalogJson.radPregledan,
								izvrseniRadOverava: 				nalogJson.izvrseniRadOverava,
								radPregledao: 						nalogJson.radPregledao,
								datumIspostavljanjaNarudzbenice: 	nalogJson.datumIspostavljanjaNarudzbenice,
								okvirniUgovor: 						nalogJson.okvirniUgovor,
								okvirniUgovor2: 					nalogJson.okvirniUgovor2,
								pdv: 								nalogJson.pdv,
								penal:								nalogJson.penal,	
								brojFakture: 						nalogJson.brojFakture
							}};
			naloziDB.updateOne({uniqueId:nalogJson.uniqueId},setObj, (err , collection) => {
				if(err){
					console.log(err);
					console.log("Greska u bazi podataka")
				}else{
					const worker 		=	new Worker("./fakturaPremijusWorker.js",{ env:SHARE_ENV});
					worker.postMessage(req.body.nalogjson);
					worker.on("message",(data)=>{
						try{
							var responseBody	=	JSON.parse(data);
							if(responseBody.InvoiceId){
								var fakturaPremijus	=	responseBody;
								var setObj	=	{ $set: {
													statusNaloga: 		"Fakturisan",
													premijusFaktura: 	fakturaPremijus
												}};
								naloziDB.updateOne({uniqueId:nalogJson.uniqueId},setObj, (err , collection) => {
									if(err){
										console.log(err);
										res.render('messagePremijus',{
											user: req.session.user,
											message: "Faktura uspesno okacena na SEF ALI! doslo je do greske u bazi podataka: "+err.toString()
										});
									}else{
										
										res.render('messagePremijus',{
											user: req.session.user,
											message: "Faktura uspesno okacena na SEF."
										});
										
									}
								});

							}else{
								messagePremijus = "PREMIJUS: Status naloga je promenjen u \"Fakturisan\" ALIII doslo je do problema sa eFakturom: <br>"+JSON.stringify(responseBody)+ "<br><div class=\"button\" style=\"padding:0\"><a style=\"display:block;padding:6px 24px\" href=\"/pdfView/premijus/"+nalogJson.uniqueId+"\">Povratak na nalog</a>";
							}
						}catch(err){
							res.render('messagePremijus',{
								user: req.session.user,
								message: "Doslo je do greske: <br>"+err.toString() + "<br>" + data
							});
						}
						
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.get('/svi-zavrseni-nalozi',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			naloziDB.find({statusNaloga:"Završeno"}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("listaNaloga",{
						nalozi: nalozi,
						pageTitle: "Završeni nalozi",
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
	
});

server.get('/fakturisaniNalozi',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			naloziDB.find({statusNaloga:"Spreman za fakturisanje"}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("listaNaloga",{
						nalozi: nalozi,
						pageTitle: "Spremni za fakturisanje",
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
	
});

server.get('/nalozi-u-stambenom',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			naloziDB.find({statusNaloga:"Nalog u Stambenom"}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("listaNaloga",{
						nalozi: nalozi,
						pageTitle: "Nalozi u stambenom",
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
	
});

server.get('/mojiNalozi',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){//ukupanIznos:{ $in: ["","0.00"]},nalogUStambenom:{$in: ["",null,"0"]}
			naloziDB.find({radnaJedinica:{ $in: req.session.user.opstine},statusNaloga:{$nin: ["Storniran","Nalog u Stambenom","Spreman za fakturisanje","Fakturisan"]}}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("mojiNalozi",{
						nalozi: nalozi,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
	
});

server.get('/naloziPoMajstoruNaDan',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){//ukupanIznos:{ $in: ["","0.00"]},nalogUStambenom:{$in: ["",null,"0"]}
			var currentDate	=	new Date();
			naloziDB.aggregate({}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					var naloziToShow	=	[];
					for(var i=0;i<nalozi.length;i++){
						if(nalozi[i].datumiDodeljivanja){
							for(var j=0;j<nalozi[i].datumiDodeljivanja.length;j++){
								var datum 	=	new Date(Number(nalozi[i].datumiDodeljivanja[j].datetime));
								var datumToCompare	=	datum.getDate()+"-"+datum.getMonth()+"-"+datum.getFullYear();
								var datumToCompare2	=	currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear();
								if(datumToCompare==datumToCompare2){
									naloziToShow.push(nalozi[i])
								}
							}
						}
					}
					majstoriDB.find({}).toArray(async (err,majstori)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							res.render("naloziPoMajstoruNaDan",{
								nalozi: naloziToShow,
								majstori: majstori,
								datumToCompare: datumToCompare, 
								user: req.session.user
							});
						}
					});

				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.post('/naloziPoMajstoruNaDan',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){//ukupanIznos:{ $in: ["","0.00"]},nalogUStambenom:{$in: ["",null,"0"]}
			var currentDate	=	new Date(req.body.data);
			naloziDB.aggregate({}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					var naloziToShow	=	[];
					for(var i=0;i<nalozi.length;i++){
						if(nalozi[i].datumiDodeljivanja){
							for(var j=0;j<nalozi[i].datumiDodeljivanja.length;j++){
								var datum 	=	new Date(Number(nalozi[i].datumiDodeljivanja[j].datetime));
								var datumToCompare	=	datum.getDate()+"-"+datum.getMonth()+"-"+datum.getFullYear();
								var datumToCompare2	=	currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear();
								if(datumToCompare==datumToCompare2){
									naloziToShow.push(nalozi[i])
								}
							}
						}
					}
					majstoriDB.find({}).toArray(async (err,majstori)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							res.render("naloziPoMajstoruNaDan",{
								nalozi: naloziToShow,
								majstori: majstori,
								datumToCompare: req.body.data, 
								user: req.session.user
							});
						}
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/validacije',async (req,res)=> {
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			res.render("validacije",{
				user:req.session.user
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/");
	}
});

server.post('/validacije',async (req,res)=> {
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			naloziDB.find({datumValidacije:req.body.datum}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("tabelaValidacije",{
						user:req.session.user,
						datum: req.body.datum,
						nalozi: nalozi
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/");
	}
});

server.post('/naloziNaDan',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			var date 	=	req.body.date;
			var dateForSearch	=	date.split("-")[2]+"."+date.split("-")[1]+"."+date.split("-")[0];
			naloziDB.find({datum:{ $regex: dateForSearch}}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("naloziNaDan",{
						nalozi: nalozi,
						datum: req.body.date,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/podizvodjac',async (req,res)=> {
	if(req.session.user){
		if(Number(req.session.user.role)==30){
			naloziDB.find({majstorNaloga:req.session.user.nalozi,statusNaloga:{$nin: ["Nalog u Stambenom","Spreman za fakturisanje","Fakturisan","Storniran","Storniran na SEF-u"]}}).toArray(async (err,nalozi)=>{//statusNaloga:{$nin: ["Nalog u Stambenom","Spreman za fakturisanje","Fakturisan","Storniran","Storniran na SEF-u"]}
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("podizvodjac",{
						nalozi: nalozi,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/podizvodjac/arhiva',async (req,res)=> {
	if(req.session.user){
		if(Number(req.session.user.role)==30){
			naloziDB.find({majstorNaloga:req.session.user.nalozi,statusNaloga:{$in: ["Nalog u Stambenom","Spreman za fakturisanje","Fakturisan","Storniran","Storniran na SEF-u"]}}).toArray(async (err,nalozi)=>{//statusNaloga:{$nin: ["Nalog u Stambenom","Spreman za fakturisanje","Fakturisan","Storniran","Storniran na SEF-u"]}
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("podizvodjac",{
						nalozi: nalozi,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/premijus',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==5){
			naloziDB.find({statusNaloga:{$in: ["Spreman za fakturisanje","Fakturisan","Storniran na SEF-u"]}}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("premijus",{
						nalozi: nalozi,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
	
});

server.get('/premijus/spremni',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==5){
			naloziDB.find({statusNaloga:{$in: ["Spreman za fakturisanje","Storniran na SEF-u"]}}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("premijus",{
						nalozi: nalozi,
						vrsta: "Nalozi Spremni za fakturisanje",
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/premijus/fakturisani',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==5){
			naloziDB.find({statusNaloga:{$in: ["Fakturisan","Storniran na SEF-u"]}}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("premijus",{
						nalozi: nalozi,
						vrsta: "Fakturisani nalozi",
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});


server.get('/pregledNaloga',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			naloziDB.find({statusNaloga:{$nin:["Storniran", "Storniran na SEF-u"]}}).toArray(async (err,nalozi)=>{//nalogFakturisan:{$in:[null,"0",0]}
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("pregledNaloga",{
						nalozi: nalozi,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/stornirani',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			naloziDB.find({statusNaloga:{$in:["Storniran", "Storniran na SEF-u"]}}).toArray(async (err,nalozi)=>{//nalogFakturisan:{$in:[null,"0",0]}
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("listaNaloga",{
						nalozi: nalozi,
						pageTitle: "Stornirani nalozi",
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
	
});

server.get('/kategorijeRadova',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			naloziDB.find({}).toArray(async (err,nalozi)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					majstoriDB.find({}).toArray(async (err,majstori)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							res.render("kategorijeRadova",{
								nalozi: nalozi,
								majstori: majstori,
								user: req.session.user
							});
						}
					})
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

var monthNames	=	["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"];

server.get('/radniDani/:year/:month',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=10){
			usersDB.find({}).toArray(async (err,korisnici)=>{
				if(err){
					console.log(err)
				}else{
					for(var i=0;i<korisnici.length;i++){
						delete korisnici[i].password;
					}
					dnevniceDB.find({month:req.params.month.toString(),date:{$regex:req.params.year}}).toArray(async (err,dnevnice)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							res.render("radniDani",{
								dnevnice: dnevnice,
								pageTitle: "Radni dani za "+monthNames[Number(req.params.month)-1]+"/"+req.params.year,
								korisnici: korisnici,
								month: req.params.month,
								year: req.params.year,
								user: req.session.user
							});
						}
					});
				}
			})
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
	
});

server.get('/majstori',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			majstoriDB.find({}).toArray(async (err,majstori)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.render("majstori",{
						majstori: majstori,
						user: req.session.user
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.post('/majstori-edit',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			var majstorJson	=	{};
			majstorJson.uniqueId	=	req.body.uniqueid;
			majstorJson.ime 		=	req.body.name;
			majstorJson.telefon 	=	req.body.telefon;
			majstorJson.opstine 	=	req.body.opstine;
			if(majstorJson.uniqueId=="new"){
				//dodaj novog majstora
				majstorJson.uniqueId	=	generateId(5)+"--"+new Date().getTime();
				majstoriDB.insertOne(majstorJson,async (err,addedResult)=>{
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						res.redirect("/majstori");
					}
				})  
			}else{
				//edituj majstora
				majstoriDB.replaceOne({uniqueId:req.body.uniqueid},majstorJson, (err , collection) => {
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						res.redirect("/majstori");
					}
				});
			}
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.post('/majstor-activate',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			var setObj	=	{ $set: {inactive:req.body.activate}};
			majstoriDB.updateOne({uniqueId:req.body.uniqueid},setObj, (err , collection) => {
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.redirect("/majstori");
					
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});


server.post('/nadji-nalog-broj',async (req,res)=>{
	naloziDB.find({broj:req.body.brojnaloga.toString()}).toArray(async (err,nalozi)=>{
		if(err){
			console.log(err);
			res.send("greska u bazi podataka");
		}else{
			if(nalozi.length>0){
				if(req.session.user){
					res.redirect("/pdfView/"+nalozi[0].uniqueId)
				}else{
					res.redirect("/pdfView/outside/"+nalozi[0].uniqueId)
				}
				
			}else{
				if(req.session.user){
					res.render("message",{
						message: "Nalog pod brojem "+req.body.brojnaloga+" nije u bazi podataka. Kliknite <a href=\"/nadji-nalog-interno\" style=\"color:rgb(32,51,100);text-decoration:underline;font-weight:600\">ovde</a> za povratak na pretragu.",
						user: req.session.user
					});
				}else{
					res.render("messageOutside",{
						message: "Nalog pod brojem "+req.body.brojnaloga+" nije u bazi podataka. Kliknite <a href=\"/nadji-nalog\" style=\"color:rgb(32,51,100);text-decoration:underline;font-weight:600\">ovde</a> za povratak na pretragu."
					});
				}
				
			}
		}
	});
});

server.post('/nadji-nalog-adresa',async (req,res)=>{
	naloziDB.find({adresa:{$regex : req.body.adresanaloga.toString()}}).toArray(async (err,nalozi)=>{
		if(err){
			console.log(err);
			res.send("greska u bazi podataka");
		}else{
			if(req.session.user){
				res.render("listaNaloga",{
					nalozi: nalozi,
					pageTitle: "Nalozi po adresi \""+ req.body.adresanaloga.toString()+"\"",
					user: req.session.user
				});
			}else{
				res.render("listaNalogaEksterno",{
					nalozi: nalozi,
					pageTitle: "Nalozi po adresi \""+ req.body.adresanaloga.toString()+"\""
				});
			}
			
			
		}
	});
});

server.get('/nadji-nalog-interno',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			res.render("nadjiNalogInterno",{
				user:req.session.user
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});



server.get('/obracunavanje',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			majstoriDB.find({}).toArray(async (err,majstori)=>{
				if(err){
					console.log(err);
					res.render("message",{
						message: "Greska u bazi podataka"
					});
				}else{
					res.render("obracunavanje",{
						user: req.session.user,
						cenovnik: prices,
						majstori: majstori
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/obracunavanje/:uniqueId',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			majstoriDB.find({}).toArray(async (err,majstori)=>{
				if(err){
					console.log(err);
					res.render("message",{
						user: req.session.user,
						message: "Greska u bazi podataka"
					});
				}else{
					ucinakDB.find({uniqueId:req.params.uniqueId}).toArray(async (err,ucinak)=>{
						if(err){
							console.log(err);
							res.render("message",{
								user: req.session.user,
								message: "Greska u bazi podataka"
							});
						}else{
							res.render("obracunavanje",{
								user: req.session.user,
								cenovnik: prices,
								obracun: ucinak[0],
								majstori: majstori
							});
						}
					})
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.post('/ucinakMajstora',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			if(Number(req.body.idobracuna)==1){
				try{
					var obracun = JSON.parse(req.body.json);
					obracun.uniqueId = new Date().getTime() +"--"+generateId(10);
					ucinakDB.insertOne(obracun,async (err,addedResult)=>{
						if(err){
							console.log(err);
							res.render("message",{
								user: req.session.user,
								message: "Greska u bazi podataka"
							});
						}else{
							res.render("message",{
								user: req.session.user,
								message: "Ucinak unet za majstora " + obracun.majstorName + " za datum "+obracun.datum +" za nalog "+obracun.brojNaloga+" u iznosu od "+brojSaRazmacima(obracun.ukupanIznos) + " RSD"
							});
						}
					})
				}catch(err){
					console.log(err);
					res.render("message",{
						user: req.session.user,
						message: "Greska u obradi podataka"
					});
				}
			}else{
				try{
					var obracun = JSON.parse(req.body.json);
					var setObj	=	{ $set: {
												majstor: obracun.majstor,
												majstorName: obracun.majstorName,
												datum: obracun.datum,
												brojNaloga: obracun.brojNaloga,
												ukupanIznos: obracun.ukupanIznos,
												obracun: obracun.obracun
											}
										};
					ucinakDB.updateOne({uniqueId:req.body.idobracuna},setObj, (err , collection) => {
						if(err){
							console.log(err);
							res.render("message",{
								user: req.session.user,
								message: "Greska u bazi podataka"
							});
						}else{
							res.render("message",{
								user: req.session.user,
								message: "Ucinak izmenjen za majstora: " + obracun.majstorName + " za datum "+obracun.datum +" u iznosu od "+brojSaRazmacima(obracun.ukupanIznos) + " RSD"
							});
						}
					});
				}catch(err){
					console.log(err);
					res.render("message",{
						user: req.session.user,
						message: "Greska u obradi podataka"
					});
				}
				
			}
			
			
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.get('/pretraga-obracuna',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			majstoriDB.find({}).toArray(async (err,majstori)=>{
				if(err){
					console.log(err);
					res.render("message",{
						user: req.session.user,
						message: "Greska u bazi podataka"
					});
				}else{
					res.render("pretraga-obracuna",{
						user: req.session.user,
						majstori: majstori
					});
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.post('/nadji-ucinak-broj',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			ucinakDB.find({brojNaloga:req.body.broj.toString()}).toArray(async (err,ucinci)=>{
				if(err){
					console.log(err);
					res.render("message",{
						user: req.session.user,
						message: "Greska u bazi podataka"
					});
				}else{
					res.render("lista-ucinka",{
						user: req.session.user,
						ucinci: ucinci
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.post('/nadji-ucinak-datum',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			ucinakDB.find({datum:req.body.datum}).toArray(async (err,ucinci)=>{
				if(err){
					console.log(err);
					res.render("message",{
						user: req.session.user,
						message: "Greska u bazi podataka"
					});
				}else{
					res.render("lista-ucinka",{
						user: req.session.user,
						ucinci: ucinci
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.post('/nadji-ucinak-majstor',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)==10){
			ucinakDB.find({majstor:req.body.majstor}).toArray(async (err,ucinci)=>{
				if(err){
					console.log(err);
					res.render("message",{
						user: req.session.user,
						message: "Greska u bazi podataka"
					});
				}else{
					res.render("lista-ucinka",{
						user: req.session.user,
						ucinci: ucinci
					});
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.get('/ucinak',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=20){
			majstoriDB.find({}).toArray(async (err,majstori)=>{
				if(err){
					console.log(err);
					res.render("message",{
						user: req.session.user,
						message: "Greska u bazi podataka"
					});
				}else{
					ucinakDB.find({}).toArray(async (err,ucinci)=>{
						res.render("ucinak-majstora",{
							user: req.session.user,
							majstori: majstori,
							ucinci: ucinci
						});
					});
					
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

function reshuffleDate(dateAsString){
	var array = dateAsString.split("-");
	return array[2]+"."+array[1]+"."+array[0]+".";//dd.mm.yyyyy.
}

function getDateAsStringForInputObject(date){
	var yearString	=	date.getFullYear();
	var month		=	eval(date.getMonth()+1);
	var monthString	=	(month<10) ? "0" + month : month;
	var day			=	date.getDate();
	var dayString	=	(day<10) ? "0" + day : day;
	return	yearString+"-"+monthString+"-"+dayString;
}

function getDateAsString(date){
	var yearString	=	date.getFullYear();
	var month		=	eval(date.getMonth()+1);
	var monthString	=	(month<10) ? "0" + month : month;
	var day			=	date.getDate();
	var dayString	=	(day<10) ? "0" + day : day;
	return	dayString+"-"+monthString+"-"+yearString;
}

server.get('/aplikacija/:phoneid',async (req,res)=>{
	majstoriDB.find({$or:[{deviceid:req.params.phoneid.toString()},{deviceid2:req.params.phoneid.toString()},{deviceid3:req.params.phoneid.toString()}]}).toArray(async (err,majstori)=>{
		if(err){
			console.log(err);
			res.send("greska u bazi podataka");
		}else{
			if(majstori.length>0){
				var majstorJson	=	JSON.parse(JSON.stringify(majstori[0]));
				naloziDB.find({majstorNaloga:majstorJson.uniqueId,statusNaloga:{$nin:["Storniran","Storniran na SEF-u","Fakturisan","Spreman za fakturisanje"]}}).toArray(async (err,nalozi)=>{
					var uniqueIds	=	[];
					for(var i=0;i<nalozi.length;i++){
						uniqueIds.push(nalozi[i].uniqueId)
					}
					izvestajiSaTerenaDB.find({uniqueId: {$in:uniqueIds}}).toArray(async (err,izvestaji)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka")
						}else{
							res.render("majstorApp",{
								nalozi: nalozi,
								izvestaji: izvestaji,
								deviceId: req.params.phoneid
							});
						}
					})
				});
			}else{
				usersDB.find({deviceid:req.params.phoneid.toString()}).toArray(async (err,korisnici)=>{
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						if(korisnici.length>0){
							var user = JSON.parse(JSON.stringify(korisnici[0]));
							delete user.password;
							var today = new Date();
							var month = today.getMonth()+1;
							dnevniceDB.find({userId:user.email,month:month.toString()}).toArray(async (err,dnevnice)=>{
								if(err){
									console.log(err);
									res.send("Greska u bazi podataka");
								}else{
									res.render("kancelarijaApp",{
										user: user,
										today: today.getTime(),
										deviceid: req.params.phoneid.toString(),
										dnevnice: dnevnice 
									})
								}
							});
							
						}else{
							res.redirect("/registracija-aplikacije/"+req.params.phoneid);
						}
					}
				});
				
			}
		}
	});
});

server.get('/aplikacija/:phoneid/:uniqueid',async (req,res)=>{
	majstoriDB.find({$or:[{deviceid:req.params.phoneid.toString()},{deviceid2:req.params.phoneid.toString()},{deviceid3:req.params.phoneid.toString()}]}).toArray(async (err,majstori)=>{
		if(err){
			console.log(err);
			res.send("greska u bazi podataka");
		}else{
			if(majstori.length>0){
				var majstorJson	=	JSON.parse(JSON.stringify(majstori[0]));
				naloziDB.find({uniqueId: req.params.uniqueid}).toArray(async (err,nalozi)=>{
					if(err){
						//majstorNaloga:
						console.log(err);
						res.send("Greska u bazi podataka")
					}else{
						if(nalozi.length>0){
							var nalog = JSON.parse(JSON.stringify(nalozi[0]));
							if(nalog.majstorNaloga==majstorJson.uniqueId){

								izvestajiSaTerenaDB.find({uniqueId: req.params.uniqueid}).toArray(async (err,izvestaji)=>{
									if(err){
										console.log(err);
										res.send("Greska u bazi podataka");
									}else{
										magacinProizvodiDB.find({}).toArray(async (err,proizvodi)=>{
											if(err){
												console.log(err);
												res.send("Greska u bazi podataka");
											}else{
												trebovanjaDB.find({uniqueId:req.params.uniqueid}).toArray(async (err,trebovanja)=>{
													if(err){
														console.log(err);
														res.send("Greska u bazi podataka");
													}else{
														if(trebovanja.length>0){
															res.render("majstorAppNalog",{
																nalog: nalog,
																izvestaji: izvestaji,
																proizvodi: proizvodi,
																trebovanje: trebovanja[0],
																deviceId: req.params.phoneid
															});
														}else{
															res.render("majstorAppNalog",{
																nalog: nalog,
																izvestaji: izvestaji,
																proizvodi: proizvodi,
																trebovanje: {},
																deviceId: req.params.phoneid
															});
														}
														
													}
												});
												
											}
										});
										
									}
								});

							}else{
								res.render("messageOnApp",{
									message: "Nalog nije za vas.",
									deviceId: req.params.phoneid
								});
							}
						}else{
							res.render("messageOnApp",{
								message: "Nalog ne postoji",
								deviceId: req.params.phoneid
							});
						}
						
						
					}
				});
			}else{
				res.redirect("/registracija-aplikacije/"+req.params.phoneid);
			}
		}
	});
});

/*
	{
		uniqueId
		month
		date
		starttime
		endtime
		userId
		location
	}
*/

server.get('/dnevnica/:nfcid/:phoneid',async (req,res)=>{
	//check nfcid if correct tag is scanned

	//find the user
	var phoneId	=	req.params.phoneid.toString();
	var today 	=	new Date();
	var todayString = getDateAsString(today);
	var nfcid	=	req.params.nfcid.toString();
	if(nfcid=="746F9055"){
		majstoriDB.find({deviceid:phoneId}).toArray(async (err,majstori)=>{
			if(err){
				console.log(err);
				res.send("Greska u bazi podataka")
			}else{
				if(majstori.length>0){
					//Ovde ako je nasao majstora
					res.send("Majstor");
				}else{
					usersDB.find({deviceid:phoneId}).toArray(async (err,korisnici)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							if(korisnici.length>0){
								var korisnik = JSON.parse(JSON.stringify(korisnici[0]));
								delete korisnik.password;
								dnevniceDB.find({date:todayString,userId:korisnik.email}).toArray(async (err,dnevnica)=>{
									if(err){
										console.log(err);
										res.send("Greska u bazi podataka");
									}else{
										if(dnevnica.length>0){
											if(dnevnica[0].endtime){
												res.render("kancelarijaApp",{
													user: korisnik,
													dnevnica: dnevnica[0],
													deviceid: req.params.phoneid.toString(),
													message: "Vec ste upisali kraj radnog dana za "+todayString+"."
												})
											}else{
												//Ending the day
												var endtime = new Date().getTime();
												if(endtime-Number(dnevnica[0].starttime)<900000){
													res.send("Već ste se čekirali.")
												}else{
													var setObj	=	{ $set: {endtime:endtime}};
													dnevniceDB.updateOne({uniqueId:dnevnica[0].uniqueId},setObj, (err , collection) => {
														if(err){
															console.log(err);
															res.send("Greska u bazi podataka");
														}else{
															res.render("kancelarijaApp",{
																user: korisnik,
																dnevnica: "end",
																deviceid: req.params.phoneid.toString(),
																starttime: dnevnica[0].starttime,
																endtime: endtime 
															})
														}
													});	
												}
												
											}
											
										}else{
											//Starting the day
											var startJson	=	{};
											startJson.uniqueId 	=	generateId(20);
											startJson.userId	=	korisnik.email;
											startJson.month		=	eval(today.getMonth()+1).toString();
											startJson.date		=	todayString;
											startJson.starttime	=	today.getTime();
											//startJson.location should be based on NFC ID
											dnevniceDB.insertOne(startJson,async (err,addedResult)=>{
												if(err){
													console.log(err);
													res.send("Greska u bazi podataka");
												}else{
													res.render("kancelarijaApp",{
														user: korisnik,
														dnevnica: "start",
														deviceid: req.params.phoneid.toString(),
														starttime: today.getTime() 
													})
												}
											});
										}
									}
								})	
							}else{
								res.send("Niste registrovani");
							}
							
						}
					})
				}
			}
		});	
	}else{
		res.send("Pogresan tag");
	}
});



server.post('/izvestaj-sa-terena', upload.array("image",10), async (req, res)=> {
	var izvestaji 	=	[];
	if(req.files){
		for(var i=0;i<req.files.length;i++){
			var izvestajJson	=	{};
			izvestajJson.izvestaj = req.body.izvestaj;
			izvestajJson.uniqueId = req.body.idnaloga;
			izvestajJson.majstorId = req.body.idmajstora;
			izvestajJson.status = req.body.status;
			izvestajJson.datetime = new Date().getTime();
			izvestajJson.photopath = req.files[i].path.split("public")[1];
			izvestaji.push(izvestajJson)
		}
		
	}
	req.files.forEach((value, index) =>
		setTimeout(() => {
			sharp(value.destination+"/"+value.filename)
			  .resize(1400,1900, {
			    kernel: sharp.kernel.nearest,
			    fit: 'contain',
			    position: 'right top',
			    background: { r: 255, g: 255, b: 255, alpha: 1 }
			  })
			  .toFile(value.destination+"/Compressed-"+value.filename)
			  .then(() => {
			    // output.png is a 200 pixels wide and 300 pixels high image
			    // containing a nearest-neighbour scaled version
			    // contained within the north-east corner of a semi-transparent white canvas
			  });
		}, index*1000)
      
	)
	if(izvestaji.length>0){
		izvestajiSaTerenaDB.insertMany(izvestaji,async (err,addedResult)=>{
			if(err){
				console.log(err);
				res.send("Greska u bazi podataka");
			}else{
				trebovanjaDB.find({uniqueId:req.body.idnaloga}).toArray(async (err,trebovanja)=>{
					if(err){
						console.log(err)
						res.send("Greska u bazi podataka")
					}else{
						var trebovanjeJson	=	{};
						trebovanjeJson.uniqueId = req.body.idnaloga;
						trebovanjeJson.datetime = new Date().getTime();
						trebovanjeJson.majstorId = req.body.idmajstora;
						//trebovanjeJson.stavke 	= JSON.parse(req.body.trebovanje);
						if(trebovanja.length>0){
							//replaceone
							trebovanjaDB.replaceOne({uniqueId:req.body.idnaloga},trebovanjeJson, (err , collection) => {
								if(err){
									console.log(err);
									res.send("Greska u bazi podataka");
								}else{
									res.redirect("/aplikacija/"+req.body.deviceid+"/"+req.body.idnaloga);
								}
							});
						}else{
							//insertone
							trebovanjaDB.insertOne(trebovanjeJson,async (err,addedResult)=>{
								if(err){
									console.log(err);
									res.send("Greska u bazi podataka");
								}else{
									res.redirect("/aplikacija/"+req.body.deviceid+"/"+req.body.idnaloga);
								}
							});
						}
					}
				});
				
			}
		});
	}else{
		res.redirect("/aplikacija/"+req.body.deviceid);
	}
	
});

server.post('/okaci-sliku', upload.array("image",10), async (req, res)=> {
	if(req.session.user){
		var izvestaji 	=	[];

		if(req.files){
			for(var i=0;i<req.files.length;i++){
				var izvestajJson	=	{};
				izvestajJson.izvestaj = "";
				izvestajJson.uniqueId = req.body.idnaloga;
				izvestajJson.majstorId = req.body.idmajstora;
				izvestajJson.status = req.body.status;
				izvestajJson.datetime = new Date().getTime();
				izvestajJson.photopath = req.files[i].path.split("public")[1];
				izvestaji.push(izvestajJson);
			}
			if(izvestaji.length>0){
				req.files.forEach((value, index) =>
					setTimeout(() => {
						sharp(value.destination+"/"+value.filename)
						  .resize(1400,1900, {
						    kernel: sharp.kernel.nearest,
						    fit: 'contain',
						    position: 'right top',
						    background: { r: 255, g: 255, b: 255, alpha: 1 }
						  })
						  .toFile(value.destination+"/Compressed-"+value.filename)
						  .then(() => {
						    // output.png is a 200 pixels wide and 300 pixels high image
						    // containing a nearest-neighbour scaled version
						    // contained within the north-east corner of a semi-transparent white canvas
						  });
					}, index*1000)
			      
				)
				//res.send("Ok");
				izvestajiSaTerenaDB.insertMany(izvestaji,async (err,addedResult)=>{
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						
						res.redirect("/pdfView/"+izvestajJson.uniqueId);
					}
				});
			}else{
				res.redirect("/pdfView/"+izvestajJson.uniqueId);
			}
			
			/*izvestaji.forEach((value, index) =>
				setTimeout(() => {
					 izvestajiSaTerenaDB.insertOne(value,async (err,addedResult)=>{
						if(err){
							console.log(err);
						}
					});
					 if(index==req.files.length){
						res.redirect("/pdfView/"+izvestajJson.uniqueId);
					 }
				}, index*1000)
		      
			)*/
		}else{
			res.redirect("/pdfView/"+izvestajJson.uniqueId);
		}
			
	}else{
		res.redirect("/")
	}
});

server.post('/obrisi-sliku',async (req,res)=>{
	if(req.session.user){
		var json 		=	JSON.parse(req.body.json);
		var id 			=	Number(json.id);
		var nalogId 	=	json.nalogId;
		var setObj	=	{ $set: {deleted:Number(json.delete)}};
		izvestajiSaTerenaDB.updateOne({datetime:id},setObj, (err , collection) => {
			if(err){
				console.log(err);
				res.send("Greska u bazi podataka");
			}else{
				if(Number(req.session.user.role)<30){
					res.redirect("/pdfView/"+nalogId);
				}else{
					res.redirect("/pdfView/podizvodjac/"+nalogId);	
				}
				
			}
		});
	}else{
		res.redirect("/")
	}
});

server.get('/registracija-aplikacije/:phoneid',async (req,res)=>{
	appRegisterDB.find({deviceid:req.params.phoneid.toString()}).toArray(async (err,result)=>{
		if(err){
			console.log(err);
			res.send("greska u bazi podataka");
		}else{
			if(result.length>0){
				res.render("messageOnApp",{
					message: "<div style=\"margin-bottom:10px\">Uređaj je već registrovan i čeka odobrenje.</div><div class=\"button\" onclick=\"loadGif();window.location.href='/aplikacija/"+req.params.phoneid+"'\">Osveži</div>"
				});
			}else{
				res.render("registracijaAplikacije",{});
			}
		}
	});
});

server.post('/app-register',async (req,res)=>{
	appRegisterDB.find({deviceid:req.body.deviceid.toString()}).toArray(async (err,result)=>{
		if(err){
			console.log(err);
			res.send("greska u bazi podataka");
		}else{
			if(result.length>0){
				res.render("messageOnApp",{
					message: "<div style=\"margin-bottom:10px\">Uređaj je već registrovan i čeka odobrenje.</div><div class=\"button\" onclick=\"loadGif();window.location.href='/aplikacija/'"+req.body.deviceid+"\">Osveži</div>"
				});
			}else{
				var deviceJson	=	{
					deviceid: req.body.deviceid.toString(),
					name: 	req.body.name
				}
				appRegisterDB.insertOne(deviceJson,async (err,addedResult)=>{
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						res.redirect("/aplikacija/"+req.body.deviceid);
					}
				});
			}
		}
	});
});

server.get('/magacin-stanje',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			magacinProizvodi3DB.find({}).toArray(async (err,proizvodi)=>{
				if(err){
					console.log(err);
					res.send("greska u bazi podataka");
				}else{
					magacinReversi3DB.find({}).toArray(async (err,reversi)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							var brojeviNaloga 	=	[];
							for(var i=0;i<reversi.length;i++){
								brojeviNaloga.push(reversi[i].nalog)
							}
							naloziDB.find({broj:{$in:brojeviNaloga}}).toArray(async (err,nalozi)=>{
								if(err){
									console.log(err);
									res.send("Greska u bazi podataka");
								}else{
									for(var i=0;i<nalozi.length;i++){
										for(var j=0;j<reversi.length;j++){
											if(nalozi[i].broj==reversi[j].nalog){
												reversi[j].adresa = nalozi[i].adresa.split(",")[0];
											}
										}
									}
									magacinUlazi3DB.find({}).toArray(async (err,ulazi)=>{
										if(err){
											console.log(err);
											res.send("Greska u bazi podataka");
										}else{
											majstoriDB.find({}).toArray(async (err,majstori)=>{
												if(err){
													console.log(err);
													res.send("Greska u bazi podataka");
												}else{
													res.render("magacinStanje",{
														proizvodi: proizvodi,
														reversi: reversi,
														ulazi: ulazi,
														majstori: majstori,
														user: req.session.user
													});
												}
											});
											
										}
									});
								}
							});
							
							
						}
					});
					
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});


server.post('/magacin-set-stanje',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var setObj	=	{ $set: {stanje:Number(req.body.quantity)}};
			magacinProizvodi3DB.updateOne({uniqueId:req.body.productid},setObj, (err , collection) => {
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka")
				}else{
					/*var ulazJson	=	{};
					ulazJson.uniqueId			=	generateId(5)+"--"+new Date().getTime();
					ulazJson.productUniqueId	=	req.body.productid;
					ulazJson.quantity			=	Number(req.body.quantity);
					ulazJson.datetime			=	new Date().getTime();
					ulazJson.user				=	req.session.user.email;
					magacinUlazi3DB.insertOne(ulazJson,async (err,addedResult)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							res.redirect("/magacin-stanje");
						}
					});*/
					res.redirect("/magacin-stanje");
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
})

server.post('/revers',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var reversJson	=	JSON.parse(req.body.json);
			if(reversJson.uniqueId){
				//edit existing revers
				magacinReversi3DB.replaceOne({uniqueId:reversJson.uniqueId},reversJson, (err , collection) => {
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						res.redirect("/magacin-stanje");
					}
				});
			}else{
				//make new revers
				reversJson.uniqueId	=	generateId(5)+"--"+ new Date().getTime();
				reversJson.datetime = new Date().getTime();
				magacinReversi3DB.insertOne(reversJson,async (err,addedResult)=>{
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						res.redirect("/magacin-stanje");
					}
				})
			}
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});


server.post('/delete-unos',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var removeId	=	req.body.id;
			magacinUlazi3DB.deleteOne({uniqueId:removeId},async (err,deletionResult)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.redirect("/magacin-stanje");
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});

server.post('/delete-revers',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var removeId	=	req.body.id;
			magacinReversi3DB.deleteOne({uniqueId:removeId},async (err,deletionResult)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.redirect("/magacin-stanje");
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
});


server.post('/magacin-ulaz',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var ulazJson	=	{};
			ulazJson.uniqueId			=	generateId(5)+"--"+new Date().getTime();
			ulazJson.productUniqueId	=	req.body.productid;
			ulazJson.quantity			=	Number(req.body.quantity);
			ulazJson.datetime			=	new Date().getTime();
			ulazJson.user				=	req.session.user.email;
			magacinUlazi3DB.insertOne(ulazJson,async (err,addedResult)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka");
				}else{
					res.redirect("/magacin-stanje");
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
	
});


server.post('/magacin-set-proizvod-attributes',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var setObj	=	{ $set: {
								alarm:Number(req.body.alarm),
								price:Number(req.body.price)
									}
							};
			magacinProizvodi3DB.updateOne({uniqueId:req.body.productid},setObj, (err , collection) => {
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka")
				}else{
					res.redirect("/magacin-stanje");
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/")
	}
	
});

server.post('/okaci-revers',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var json = JSON.parse(req.body.json);
			if(json.uniqueId=="new"){
				json.uniqueId = generateId(7)+"--"+new Date().getTime();
				json.datetime = new Date().getTime();
				magacinReversi4DB.insertOne(json,async (err,addedResult)=>{
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka");
					}else{
						res.redirect("/pdfView/"+json.nalogUniqueId);
					}
				});
			}else{
				var setObj	=	{ $set: {
											majstor:json.majstor,
											date:json.date,
											zaduzenje: json.zaduzenje
										}
								};
				magacinReversi4DB.updateOne({uniqueId:json.uniqueId},setObj, (err , collection) => {
					if(err){
						console.log(err);
						res.send("Greska u bazi podataka")
					}else{
						res.redirect("/pdfView/"+json.nalogUniqueId);
					}
				});
			}
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/");
	}
});

server.post('/obrisi-revers',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			magacinReversi4DB.deleteOne({uniqueId:req.body.uniqueid},async (err,deletionResult)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka")
				}else{
					res.redirect("/pdfView/"+req.body.naloguniqueid);
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/");
	}
});


server.get('/magacin-stanje2',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			magacinProizvodi4DB.find({}).toArray(async (err,proizvodi)=>{
				if(err){
					console.log(err);
					res.send("greska u bazi podataka");
				}else{
					magacinReversi4DB.find({}).toArray(async (err,reversi)=>{
						if(err){
							console.log(err);
							res.send("Greska u bazi podataka");
						}else{
							magacinUlazi4DB.find({}).toArray(async (err,ulazi)=>{
								if(err){
									console.log(err);
									res.send("Greska u bazi podataka");
								}else{
									majstoriDB.find({}).toArray(async (err,majstori)=>{
										if(err){
											console.log(err);
											res.send("Greska u bazi podataka");
										}else{
											res.render("magacinStanje2",{
												proizvodi: proizvodi,
												reversi: reversi,
												ulazi: ulazi,
												majstori: majstori,
												user: req.session.user
											});
										}
									});
									
									
								}
							});
						}
					});
					
				}
			});
		}else{
			res.redirect("/")
		}
	}else{
		res.redirect("/")
	}
});

server.post('/izmeni-proizvod',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var json = JSON.parse(req.body.json);
			if(json.popis){
				var setObj	=	{ $set: {
										pricelistCode:json.pricelistCode,
										alarm:json.alarm,
										stanje:json.popis,
										price:json.price,
										datumPopisa:json.datumPopisa
									}
							};
			}else{
				var setObj	=	{ $set: {
										pricelistCode:json.pricelistCode,
										alarm:json.alarm,
										price:json.price
									}
							};
			}
			
			magacinProizvodi4DB.updateOne({uniqueId:json.uniqueId},setObj, (err , collection) => {
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka")
				}else{
					res.redirect("/magacin-stanje2");
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/");
	}
});

server.post('/sacuvaj-ulaz',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			var json = JSON.parse(req.body.json);
			var insertJson = {};
			insertJson.uniqueId = generateId(7)+"--"+new Date().getTime();
			insertJson.productUniqueId = json.uniqueId;
			insertJson.quantity = json.kolicina;
			insertJson.datum = json.datum;
			magacinUlazi4DB.insertOne(insertJson,function(err,addedResult){
				if(err){
					console.log(err)
					res.send("Greska u bazi podataka")
				}else{
					res.redirect("/magacin-stanje2");
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/");
	}
});

server.post('/obrisi-ulaz',async (req,res)=>{
	if(req.session.user){
		if(Number(req.session.user.role)<=25){
			magacinUlazi4DB.deleteOne({uniqueId:req.body.id},async (err,deletionResult)=>{
				if(err){
					console.log(err);
					res.send("Greska u bazi podataka")
				}else{
					res.redirect("/magacin-stanje2");
				}
			});
		}else{
			res.redirect("/");
		}
	}else{
		res.redirect("/");
	}
});



















function parseData(data){
	var nalogArray	=	data.split("\n");
	var nalogJson	=	{
		//rawText: data, 
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
server.get('*',function(req,res){
	res.send("Nepostojeci link")
});

process.on('SIGINT', function(){
	if(database){
		database.close()
	}
	console.log("Database Closed [SIGINT]");
	process.exit();
});
process.on('SIGTERM', function(){
	if(database){
		database.close()
	}
	console.log("Database Closed [SIGTERM]");
	process.exit();
});
process.on('exit', function(){
	if(database){
		database.close()
	}
	console.log("Database Closed [EXIT]");
	process.exit();
});

process.on('uncaughtException', function (exception) {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});


















