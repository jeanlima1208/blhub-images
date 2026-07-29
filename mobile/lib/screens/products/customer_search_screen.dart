import 'package:flutter/material.dart';
import '../../api/customer_service.dart';
import 'customer_create_screen.dart';


class CustomerSearchScreen extends StatefulWidget {

  const CustomerSearchScreen({super.key});


  @override
  State<CustomerSearchScreen> createState() =>
      _CustomerSearchScreenState();

}



class _CustomerSearchScreenState
    extends State<CustomerSearchScreen> {


  List<String> customers = [];

  List<String> filtered = [];



  @override
  void initState() {

    super.initState();

    loadCustomers();

  }



  Future<void> loadCustomers() async {

    customers = await CustomerService.getCustomers();


    setState(() {

      filtered = customers;

    });

  }



  void filter(String value) {

    setState(() {

      filtered = customers

          .where(

            (c) => c

                .toLowerCase()

                .contains(value.toLowerCase()),

          )

          .toList();

    });

  }



  @override
  Widget build(BuildContext context) {


    return Scaffold(


      appBar: AppBar(


        title: const Text("Selecionar Cliente"),



        actions: [


          IconButton(


            icon: const Icon(Icons.person_add),


            onPressed: () async {


              final result = await Navigator.push(


                context,


                MaterialPageRoute(


                  builder: (_) => const CustomerCreateScreen(),


                ),


              );



              if (result != null) {


                await loadCustomers();



                setState(() {


                  filtered = customers;


                });


              }


            },


          ),


        ],


      ),



      body: Column(


        children: [



          Padding(


            padding: const EdgeInsets.all(12),


            child: TextField(


              onChanged: filter,


              decoration: const InputDecoration(


                hintText: "Pesquisar cliente...",


                prefixIcon: Icon(Icons.search),


              ),


            ),


          ),



          Expanded(


            child: ListView.builder(


              itemCount: filtered.length,


              itemBuilder: (_, index) {


                final customer = filtered[index];



                return ListTile(


                  title: Text(customer),



                  onTap: () {


                    Navigator.pop(context, customer);


                  },


                );


              },


            ),


          ),


        ],


      ),


    );


  }


}