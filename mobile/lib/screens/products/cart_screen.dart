import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/cart_provider.dart';
import '../../api/sales_service.dart';
import 'customer_search_screen.dart';

class CartScreen extends StatelessWidget {

  const CartScreen({Key? key}) : super(key: key);


  Widget _resumeRow(
    String title,
    double value,
    Color color, {
    bool bold = false,
    double size = 16,
  }) {

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [

        Text(
          title,
          style: TextStyle(
            color: Colors.white70,
            fontWeight:
                bold ? FontWeight.bold : FontWeight.normal,
          ),
        ),

        Text(
          "R\$ ${value.toStringAsFixed(2)}",
          style: TextStyle(
            color: color,
            fontSize: size,
            fontWeight:
                bold ? FontWeight.bold : FontWeight.w600,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {

    const Color darkBgColor = Color(0xFF0F1115);
    const Color cardBgColor = Color(0xFF161920);
    const Color neonGreen = Color(0xFF00FF66);
    const Color textPrimary = Colors.white;
    const Color textSecondary = Color(0xFF94A3B8);
    const Color danger = Colors.redAccent;


    return Scaffold(

      backgroundColor: darkBgColor,

      appBar: AppBar(
        title: const Text(
          'Seu Pedido',
        ),
        centerTitle: true,
        backgroundColor: darkBgColor,
      ),


      body: Consumer<CartProvider>(

        builder: (context, cart, child) {


          final items = cart.itemsList;


          if(items.isEmpty){

            return const Center(
              child: Text(
                "Carrinho vazio",
                style: TextStyle(
                  color: textSecondary,
                ),
              ),
            );

          }



          return Column(

            children: [


              Expanded(

                child: SingleChildScrollView(

                  child: Column(

                    children: [


                      ListView.separated(

                        shrinkWrap: true,

                        physics:
                        const NeverScrollableScrollPhysics(),

                        padding:
                        const EdgeInsets.all(16),

                        itemCount: items.length,


                        separatorBuilder: (_,__)=>
                        const SizedBox(height:12),


                        itemBuilder: (context,index){


                          final item = items[index];


                          return Container(

                            padding:
                            const EdgeInsets.all(14),

                            decoration:
                            BoxDecoration(

                              color: cardBgColor,

                              borderRadius:
                              BorderRadius.circular(18),

                            ),


                            child: Row(

                              crossAxisAlignment:
                              CrossAxisAlignment.start,


                              children: [

                                 // FOTO
                                Container(
                                  width: 80,
                                  height: 80,

                                  decoration: BoxDecoration(
                                    color: Colors.black26,
                                    borderRadius:
                                    BorderRadius.circular(12),
                                  ),

                                  child: const Icon(
                                    Icons.image,
                                    color: Colors.white30,
                                    size: 38,
                                  ),
                                ),


                                const SizedBox(width: 14),



                                Expanded(

                                  child: Column(

                                    crossAxisAlignment:
                                    CrossAxisAlignment.start,


                                    children: [


                                      Text(
                                        item.name,

                                        maxLines: 2,

                                        overflow:
                                        TextOverflow.ellipsis,

                                        style: const TextStyle(
                                          color: textPrimary,
                                          fontWeight:
                                          FontWeight.bold,
                                          fontSize: 15,
                                        ),
                                      ),



                                      const SizedBox(height: 6),



                                      Container(

                                        padding:
                                        const EdgeInsets.symmetric(
                                          horizontal: 10,
                                          vertical: 4,
                                        ),


                                        decoration:
                                        BoxDecoration(

                                          color: Colors.white10,

                                          borderRadius:
                                          BorderRadius.circular(20),

                                        ),


                                        child: Text(

                                          "Tamanho ${item.size}",

                                          style:
                                          const TextStyle(

                                            color:
                                            textSecondary,

                                            fontSize: 12,

                                          ),

                                        ),
                                      ),



                                      const SizedBox(height: 10),



                                      Text(

                                        "R\$ ${item.price.toStringAsFixed(2)}",

                                        style:
                                        const TextStyle(

                                          color:
                                          neonGreen,

                                          fontSize: 18,

                                          fontWeight:
                                          FontWeight.bold,

                                        ),
                                      ),



                                      const SizedBox(height: 10),



                                      Row(

                                        children: [


                                          InkWell(

                                            onTap: () =>
                                                cart.decreaseQuantity(item.id),


                                            borderRadius:
                                            BorderRadius.circular(30),


                                            child: Container(

                                              width: 34,

                                              height: 34,


                                              decoration:
                                              BoxDecoration(

                                                color:
                                                Colors.white10,

                                                borderRadius:
                                                BorderRadius.circular(30),

                                              ),


                                              child:
                                              const Icon(

                                                Icons.remove,

                                                color:
                                                Colors.white,

                                                size: 18,

                                              ),
                                            ),
                                          ),



                                          SizedBox(

                                            width:45,

                                            child: Center(

                                              child: Text(

                                                item.quantity.toString(),

                                                style:
                                                const TextStyle(

                                                  color:
                                                  textPrimary,

                                                  fontSize:18,

                                                  fontWeight:
                                                  FontWeight.bold,

                                                ),
                                              ),
                                            ),
                                          ),




                                          InkWell(

                                            onTap: () =>
                                                cart.increaseQuantity(item.id),


                                            borderRadius:
                                            BorderRadius.circular(30),


                                            child: Container(

                                              width:34,

                                              height:34,


                                              decoration:
                                              BoxDecoration(

                                                color:
                                                neonGreen,

                                                borderRadius:
                                                BorderRadius.circular(30),

                                              ),


                                              child:
                                              const Icon(

                                                Icons.add,

                                                color:
                                                Colors.black,

                                                size:18,

                                              ),
                                            ),
                                          ),



                                          const Spacer(),



                                          Text(

                                            "Subtotal\nR\$ ${item.subtotal.toStringAsFixed(2)}",

                                            textAlign:
                                            TextAlign.end,


                                            style:
                                            const TextStyle(

                                              color:
                                              neonGreen,

                                              fontWeight:
                                              FontWeight.bold,

                                            ),
                                          ),

                                        ],
                                      ),

                                    ],
                                  ),
                                ),




                                  IconButton(
  onPressed: () => cart.removeItem(item.id),

  icon: const Icon(
    Icons.delete_outline,
    color: danger,
  ),
),


                              ],
                            ),
                          );

                        },
                      ),



                      const SizedBox(height:10),



                      _customerCard(context, cart),



                      const SizedBox(height:14),



                      _paymentCard(cart),

                      _advanceCard(context, cart),


                      const SizedBox(height:14),



                      _discountCard(cart),



                      const SizedBox(height:20),


                    ],
                  ),
                ),
              ),

               // RESUMO FIXO

              Container(

                padding: const EdgeInsets.all(20),

                decoration: const BoxDecoration(

                  color: cardBgColor,

                  border: Border(
                    top: BorderSide(
                      color: Colors.white10,
                    ),
                  ),

                ),


                child: Column(

                  mainAxisSize:
                  MainAxisSize.min,


                  children: [


                    _resumeRow(
                      "Subtotal",
                      cart.subtotal,
                      textSecondary,
                    ),


                    const SizedBox(height:8),



                    _resumeRow(
                      "Desconto",
                      -cart.discountValue,
                      Colors.orange,
                    ),



                    const SizedBox(height:8),



                    _resumeRow(
                      "Frete",
                      cart.shipping,
                      Colors.lightBlueAccent,
                    ),



                    const Divider(
                      color: Colors.white12,
                      height:28,
                    ),



                    _resumeRow(
                      "TOTAL",
                      cart.totalAmount,
                      neonGreen,
                      bold:true,
                      size:22,
                    ),



                    const SizedBox(height:20),


SizedBox(
  width: double.infinity,
  height: 55,
  child: ElevatedButton.icon(
    onPressed: () async {

      final invoice = await SalesService.createSale(cart);

      if (invoice != null) {

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Venda criada: $invoice"),
            backgroundColor: Colors.green,
          ),
        );

        cart.clearCart();

      } else {

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Erro ao criar venda"),
            backgroundColor: Colors.red,
          ),
        );

      }

    },
    style: ElevatedButton.styleFrom(
      backgroundColor: neonGreen,
      foregroundColor: Colors.black,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
      ),
    ),
    icon: const Icon(Icons.arrow_forward),
    label: const Text(
      "CONTINUAR",
      style: TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
    ),
  ),
), // fecha SizedBox

                  ], // fecha children do Column resumo

                ), // fecha Column resumo

              ), // fecha Container resumo


            ],
          );
        },
      ),
    );
  }



// ===========================
// CLIENTE
// ===========================

Widget _customerCard(BuildContext context, CartProvider cart){

    return Container(

      margin:
      const EdgeInsets.symmetric(horizontal:16),


      padding:
      const EdgeInsets.all(16),


      decoration:
      BoxDecoration(

        color:
        const Color(0xFF161920),

        borderRadius:
        BorderRadius.circular(16),

      ),


      child:
      Column(

        crossAxisAlignment:
        CrossAxisAlignment.start,


        children:[


          const Text(

            "Cliente",

            style:
            TextStyle(

              color:
              Colors.white,

              fontWeight:
              FontWeight.bold,

              fontSize:16,

            ),

          ),



          const SizedBox(height:12),



     Row(
  children: [

    const Icon(
      Icons.person,
      color: Color(0xFF94A3B8),
    ),

    const SizedBox(width: 12),

    Expanded(
      child: Text(
        cart.customer,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    ),

    ElevatedButton(
      onPressed: () async {

        final customer = await Navigator.push<String>(
          context,
          MaterialPageRoute(
            builder: (_) => const CustomerSearchScreen(),
          ),
        );

        if (customer != null) {
          cart.setCustomer(customer);
        }

      },
      child: const Text("Trocar"),
    ),

  ],
),


    ],
  ),
);
}





  // ===========================
  // PAGAMENTO
  // ===========================

  Widget _paymentCard(CartProvider cart){

    return Container(

      margin:
      const EdgeInsets.symmetric(horizontal:16),


      padding:
      const EdgeInsets.all(16),


      decoration:
      BoxDecoration(

        color:
        const Color(0xFF161920),

        borderRadius:
        BorderRadius.circular(16),

      ),


      child:
      Column(

        crossAxisAlignment:
        CrossAxisAlignment.start,


        children:[


          const Text(

            "Forma de Pagamento",

            style:
            TextStyle(

              color:
              Colors.white,

              fontWeight:
              FontWeight.bold,

            ),

          ),



          _paymentRadio(
            cart,
            PaymentMethod.pix,
            "PIX",
          ),


          _paymentRadio(
            cart,
            PaymentMethod.dinheiro,
            "Dinheiro",
          ),


          _paymentRadio(
            cart,
            PaymentMethod.cartao,
            "Cartão",
          ),


          _paymentRadio(
            cart,
            PaymentMethod.prazo,
            "A Prazo",
          ),


        ],
      ),
    );
  }



  Widget _paymentRadio(
      CartProvider cart,
      PaymentMethod method,
      String title,
      ){

    return RadioListTile(

      value:method,

      groupValue:
      cart.paymentMethod,


      activeColor:
      const Color(0xFF00FF66),


      onChanged:(value){

        cart.setPaymentMethod(value!);

      },


      title:
      Text(

        title,

        style:
        const TextStyle(
          color:Colors.white,
        ),

      ),

    );
  }






  // ===========================
  // DESCONTO / FRETE
  // ===========================


  Widget _discountCard(CartProvider cart){

    return Container(

      margin:
      const EdgeInsets.symmetric(horizontal:16),


      padding:
      const EdgeInsets.all(16),


      decoration:
      BoxDecoration(

        color:
        const Color(0xFF161920),

        borderRadius:
        BorderRadius.circular(16),

      ),


      child:
      Column(

        crossAxisAlignment:
        CrossAxisAlignment.start,


        children:[


          const Text(

            "Desconto e Frete",

            style:
            TextStyle(

              color:
              Colors.white,

              fontWeight:
              FontWeight.bold,

            ),

          ),



          const SizedBox(height:16),



          TextField(

            keyboardType:
            TextInputType.number,


            decoration:
            const InputDecoration(

              labelText:
              "Desconto (R\$)",

            ),



            onChanged:(v){

              cart.setDiscount(

                double.tryParse(
                    v.replaceAll(",", ".")
                ) ?? 0,

              );

            },

          ),




          const SizedBox(height:16),




          TextField(

            keyboardType:
            TextInputType.number,


            decoration:
            const InputDecoration(

              labelText:
              "Frete",

            ),



            onChanged:(v){

  cart.setShipping(

    double.tryParse(
        v.replaceAll(",", ".")
    ) ?? 0,

  );

},

),

        ],
      ),
    );
  }


Widget _advanceCard(BuildContext context, CartProvider cart){

  return Card(

    color: const Color(0xFF161920),

    child: Padding(

      padding: const EdgeInsets.all(16),

      child: Column(

        crossAxisAlignment:
        CrossAxisAlignment.start,

        children: [


          const Text(
            "Adiantamento",
            style: TextStyle(
              color: Colors.white,
              fontSize:18,
              fontWeight: FontWeight.bold,
            ),
          ),



          const SizedBox(height:12),



          Row(

            children: [


              Expanded(

                child: ElevatedButton(

                  onPressed: (){

                    cart.setAdvanceAmount(0);

                  },


                  child:
                  const Text(
                    "Sem entrada",
                  ),

                ),

              ),



              const SizedBox(width:10),



              Expanded(

                child: ElevatedButton(

                  onPressed: (){


                    showDialog(

                      context: context,

                      builder:(context){


                        return AlertDialog(

                          title:
                          const Text(
                            "Valor do adiantamento",
                          ),


                          content:
                          TextField(

                            keyboardType:
                            TextInputType.number,

                            decoration:
                            const InputDecoration(

                              hintText:
                              "Ex: 100.00",

                            ),

                            onChanged:(value){

                              final valor =
                              double.tryParse(
                                  value.replaceAll(",", ".")
                              ) ?? 0;


                              cart.setAdvanceAmount(valor);

                            },



                          ),


                          actions:[

                            TextButton(

                              onPressed:(){

                                Navigator.pop(context);

                              },

                              child:
                              const Text("OK"),

                            )

                          ],

                        );

                      }

                    );


                  },


                  child:
                  const Text(
                    "Adicionar entrada",
                  ),

                ),

              ),

            ],

          ),



          const SizedBox(height:15),



          Text(

            "Entrada: R\$ ${cart.advanceAmount.toStringAsFixed(2)}",

            style:
            const TextStyle(
              color:Colors.white,
            ),

          ),



          Text(

            "Saldo restante: R\$ ${cart.remainingAmount.toStringAsFixed(2)}",

            style:
            const TextStyle(
              color:Colors.greenAccent,
              fontSize:18,
              fontWeight:FontWeight.bold,
            ),

          ),


        ],

      ),

    ),

  );

}

}