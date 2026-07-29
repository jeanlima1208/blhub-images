import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

import '../providers/cart_provider.dart';
import 'api_client.dart';


class SalesService {


static Future<String?> createSale(
CartProvider cart,
) async {


try {


final items = cart.itemsList;



// ==========================
// CRIAR FATURA
// ==========================

final data = {


"doctype":"Sales Invoice",

"customer":cart.customer,

"update_stock":1,


"items":[

for(final item in items)

{

"item_code":item.id,

"qty":item.quantity,

"rate":item.price,

"warehouse":"ESTOQUE - BM",

}

],


"discount_amount":
cart.discountValue,


"remarks":
"Venda criada pelo BLHub",


};



debugPrint("CRIANDO FATURA");



final response =
await ApiClient.dio.post(


"/api/resource/Sales Invoice",


data:data,


);



final invoice =
response.data["data"]["name"];



debugPrint(
"INVOICE: $invoice"
);





// ==========================
// BUSCAR INVOICE
// ==========================


final latestInvoice =
await ApiClient.dio.get(


"/api/resource/Sales Invoice/$invoice",


);



final invoiceDoc =
latestInvoice.data["data"];




// ==========================
// SUBMIT INVOICE
// ==========================


await ApiClient.dio.post(


"/api/method/frappe.client.submit",


data:{


"doc":invoiceDoc


},


);



debugPrint(
"FATURA SUBMETIDA"
);





// ==========================
// CRIAR PAGAMENTO
// ==========================


if(cart.paymentMethod != PaymentMethod.prazo){



final double paymentValue =

cart.advanceAmount > 0

?

cart.advanceAmount

:

cart.totalAmount;




debugPrint(
"CRIANDO PAYMENT $paymentValue"
);




final paymentResponse =

await ApiClient.dio.post(


"/api/resource/Payment Entry",


data:{


"doctype":"Payment Entry",


"payment_type":"Receive",


"party_type":"Customer",


"party":cart.customer,



"paid_amount":
paymentValue,


"received_amount":
paymentValue,



"paid_from":
"Clientes - BM",



"paid_to":
"NEON - BM",



"reference_no":
"BLHUB-${DateTime.now().millisecondsSinceEpoch}",



"reference_date":

DateTime.now()
.toIso8601String()
.substring(0,10),




"references":[


{


"reference_doctype":
"Sales Invoice",


"reference_name":
invoice,


"allocated_amount":
paymentValue


}


]


},


);




final paymentName =

paymentResponse.data["data"]["name"];



debugPrint(
"PAYMENT: $paymentName"
);





// ==========================
// BUSCAR PAYMENT
// ==========================


final latestPayment =

await ApiClient.dio.get(


"/api/resource/Payment Entry/$paymentName",


);



final paymentDoc =

latestPayment.data["data"];




// ==========================
// SUBMIT PAYMENT
// ==========================


await ApiClient.dio.post(


"/api/method/frappe.client.submit",


data:{


"doc":paymentDoc


},


);



debugPrint(
"PAGAMENTO CONFIRMADO"
);



}





return invoice;



}



on DioException catch(e){


debugPrint("=================");

debugPrint("ERRO ERPNext");


debugPrint(
"STATUS: ${e.response?.statusCode}"
);


debugPrint(
"RESPOSTA ERP: ${e.response?.data}"
);


debugPrint(
"REQUEST: ${e.requestOptions.data}"
);


return null;



}



catch(e){


debugPrint(
"ERRO:"
);


debugPrint(
e.toString()
);


return null;


}



}


}