import 'package:flutter/material.dart';

enum PaymentMethod {
  pix,
  dinheiro,
  cartao,
  prazo,
}


class CartItem {

  final String id;
  final String name;
  final String size;
  final double price;

  int quantity;


  CartItem({
    required this.id,
    required this.name,
    required this.size,
    required this.price,
    required this.quantity,
  });


  double get subtotal => price * quantity;

}



class CartProvider with ChangeNotifier {


  final Map<String, CartItem> _items = {};



  //==========================
  // DADOS DA VENDA
  //==========================


  String _customer = 'Consumidor Final';


  PaymentMethod _paymentMethod = PaymentMethod.pix;


  double _discount = 0.0;

  bool _discountIsPercent = false;


  double _shipping = 0.0;


  String _remarks = '';



  //==========================
  // ADIANTAMENTO
  //==========================


  double _advanceAmount = 0.0;


  double get advanceAmount => _advanceAmount;



  double get remainingAmount {

    final value = totalAmount - _advanceAmount;

    return value < 0 ? 0 : value;

  }



  void setAdvanceAmount(double value){


    if(value < 0){

      _advanceAmount = 0;

    }

    else if(value > totalAmount){

      _advanceAmount = totalAmount;

    }

    else {

      _advanceAmount = value;

    }


    notifyListeners();

  }



  void _validateAdvance(){


    if(_advanceAmount > totalAmount){

      _advanceAmount = totalAmount;

    }


    if(_advanceAmount < 0){

      _advanceAmount = 0;

    }


  }





  //==========================
  // GETTERS
  //==========================


  Map<String, CartItem> get items => {..._items};


  List<CartItem> get itemsList => _items.values.toList();


  String get customer => _customer;


  PaymentMethod get paymentMethod => _paymentMethod;


  double get discount => _discount;


  bool get discountIsPercent => _discountIsPercent;


  double get shipping => _shipping;


  String get remarks => _remarks;





  //==========================
  // VALORES
  //==========================



  double get subtotal {


    return _items.values.fold(

      0.0,

      (sum,item)=> sum + item.subtotal,

    );


  }





  double get discountValue {


    if(_discountIsPercent){

      return subtotal * (_discount / 100);

    }


    return _discount;


  }





  double get totalAmount {


    return subtotal - discountValue + _shipping;


  }








  //==========================
  // CARRINHO
  //==========================



  void addItem(

    String id,

    String name,

    String size,

    double price,

    int quantity,

  ){



    if(_items.containsKey(id)){


      _items[id]!.quantity += quantity;


    }

    else {


      _items[id] = CartItem(

        id:id,

        name:name,

        size:size,

        price:price,

        quantity:quantity,

      );


    }



    _validateAdvance();


    notifyListeners();


  }







  void increaseQuantity(String id){


    if(!_items.containsKey(id)) return;


    _items[id]!.quantity++;


    _validateAdvance();


    notifyListeners();


  }






  void decreaseQuantity(String id){



    if(!_items.containsKey(id)) return;



    if(_items[id]!.quantity > 1){


      _items[id]!.quantity--;


    }

    else {


      _items.remove(id);


    }



    _validateAdvance();


    notifyListeners();


  }







  void removeItem(String id){


    _items.remove(id);


    _validateAdvance();


    notifyListeners();


  }







  void clearCart(){


    _items.clear();



    _discount = 0.0;

    _discountIsPercent = false;


    _shipping = 0.0;


    _remarks = '';



    _customer = 'Consumidor Final';



    _paymentMethod = PaymentMethod.pix;



    _advanceAmount = 0.0;



    notifyListeners();


  }









  //==========================
  // CLIENTE
  //==========================


  void setCustomer(String customer){


    _customer = customer;


    notifyListeners();


  }







  //==========================
  // PAGAMENTO
  //==========================


  void setPaymentMethod(PaymentMethod method){


    _paymentMethod = method;


    notifyListeners();


  }









  //==========================
  // DESCONTO
  //==========================


  void setDiscount(

    double value,

    {

    bool isPercent = false,

    }

  ){



    _discount = value;


    _discountIsPercent = isPercent;



    _validateAdvance();



    notifyListeners();


  }









  //==========================
  // FRETE
  //==========================


  void setShipping(double value){


    _shipping = value;


    _validateAdvance();


    notifyListeners();


  }









  //==========================
  // OBSERVAÇÕES
  //==========================


  void setRemarks(String value){


    _remarks = value;


    notifyListeners();


  }



}