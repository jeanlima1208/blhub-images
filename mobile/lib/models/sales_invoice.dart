class SalesInvoice {

  final String name;
  final String customer;
  final DateTime postingDate;
  final double grandTotal;
  final double outstandingAmount;
  final String status;
  final int docstatus;


  SalesInvoice({

    required this.name,
    required this.customer,
    required this.postingDate,
    required this.grandTotal,
    required this.outstandingAmount,
    required this.status,
    required this.docstatus,

  });



  factory SalesInvoice.fromJson(
      Map<String, dynamic> json
  ) {

    return SalesInvoice(

      name:
          json["name"]?.toString() ?? "",


      customer:
          json["customer"]?.toString() ?? "",


      postingDate:

          DateTime.tryParse(
            json["posting_date"]?.toString() ?? "",
          )

          ??

          DateTime.now(),



      grandTotal:

          (json["grand_total"] as num?)
              ?.toDouble()

          ??

          0.0,



      outstandingAmount:

          (json["outstanding_amount"] as num?)
              ?.toDouble()

          ??

          0.0,



      status:

          json["status"]?.toString() ?? "",



      docstatus:

          (json["docstatus"] as num?)
              ?.toInt()

          ??

          0,


    );

  }





  double get paidAmount {

    return grandTotal - outstandingAmount;

  }






  bool get isCancelled {


    return docstatus == 2 ||

        status.toLowerCase() == "cancelled";


  }






  bool get isPaid {


    if(isCancelled){

      return false;

    }


    return outstandingAmount <= 0;


  }






  bool get isPartial {


    if(isCancelled){

      return false;

    }


    return outstandingAmount > 0 &&

        outstandingAmount < grandTotal;


  }







  bool get isOpen {


    if(isCancelled){

      return false;

    }


    return outstandingAmount > 0;


  }






  String get statusLabel {


    if(isCancelled){

      return "CANCELADA";

    }



    if(isPaid){

      return "PAGO";

    }



    if(isPartial){

      return "PARCIAL";

    }



    return "EM ABERTO";


  }



}