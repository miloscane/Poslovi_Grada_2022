const {parentPort}		=	require("worker_threads");
var mongoClient			=	require('mongodb').MongoClient;
var url					=	process.env.mongourl;
var request 			=	require('request');

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
	var pdv 			=	nalog.pdv ? nalog.pdv : "35"; //35 je datum prometa a 3 je datum slanja
	var datumIspostavljanjaNarudzbenice = nalog.radPregledan.split(".")[2]+"-"+nalog.radPregledan.split(".")[1]+"-"+nalog.radPregledan.split(".")[0];
	
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
					   '<cac:OrderReference>'+
	        				'<cbc:ID>'+nalog.broj+'</cbc:ID>'+
	      				'</cac:OrderReference>'+
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
	var datumIspostavljanjaNarudzbenice = nalog.radPregledan.split(".")[2]+"-"+nalog.radPregledan.split(".")[1]+"-"+nalog.radPregledan.split(".")[0];
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
				   '<cac:OrderReference>'+
        				'<cbc:ID>'+nalog.broj+'</cbc:ID>'+
      				'</cac:OrderReference>'+
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
				      '<cbc:PayableAmount currencyID="RSD">'+eval(parseFloat(nalog.ukupanIznos)*1.2).toFixed(2)+'</cbc:PayableAmount>'+
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



parentPort.on("message", receiveObject => {
	var nalogJson	=	JSON.parse(receiveObject);
	var bodyString	=	"";
	if(Number(nalogJson.penal)>0){
		bodyString	=	generatePremijusSaPenalom(nalogJson)
	}else{
		bodyString	=	generatePremijusBezPenala(nalogJson)
	}
	var options = {
	    url: 'https://efaktura.mfin.gov.rs/api/publicApi/sales-invoice/ubl?requestId='+new Date().getTime()+'&sendToCir=No',
	    method: 'POST',
	    headers: premijusHeader,
	    body: bodyString
	};
	request(options, (error,response,body)=>{
		if(error){
			console.log(error)
			messagePremijus = "PREMIJUS: Doslo je do problema sa eFakturom: <br>"+error.toString()+ "<br><div class=\"button\" style=\"padding:0\"><a style=\"display:block;padding:6px 24px\" href=\"/pdfView/premijus/"+nalogJson.uniqueId+"\">Povratak na nalog</a>";
			parentPort.postMessage(messagePremijus)
		}else{
			var responseBody	=	{};
			try{
				responseBody	=	JSON.parse(response.body);
				var messagePremijus;
				if(responseBody.InvoiceId){
					messagePremijus	=	response.body;
				}else{
					messagePremijus = "PREMIJUS: Status naloga je promenjen u \"Fakturisan\" ALIII doslo je do problema sa eFakturom: <br>"+JSON.stringify(response.body)+ "<br><div class=\"button\" style=\"padding:0\"><a style=\"display:block;padding:6px 24px\" href=\"/pdfView/premijus/"+nalogJson.uniqueId+"\">Povratak na nalog</a>";
				}
				parentPort.postMessage(messagePremijus)
			}catch(err){
				console.log(err)
				messagePremijus = "PREMIJUS: Doslo je do problema sa eFakturom: <br>"+err.toString()+ "<br><div class=\"button\" style=\"padding:0\"><a style=\"display:block;padding:6px 24px\" href=\"/pdfView/premijus/"+nalogJson.uniqueId+"\">Povratak na nalog</a>";
				parentPort.postMessage(messagePremijus)
			}	
		}
	})
});