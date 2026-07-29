import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart'; // Ajuste o caminho conforme seu projeto

class ProductDetailScreen extends StatefulWidget {
  final String productCode;
  final String productName;
  final List<Map<String, dynamic>> variants; // Ex: [{'size': 'P', 'price': 50.0}, ...]

  const ProductDetailScreen({
    super.key,
    required this.productCode,
    required this.productName,
    required this.variants,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  // Mapa para guardar quantas unidades de cada tamanho o usuário selecionou
  Map<String, int> selectedQuantities = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.productName)),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: widget.variants.length,
              itemBuilder: (ctx, index) {
                final v = widget.variants[index];
                String size = v['size'];
                double price = v['price'];
                int qty = selectedQuantities[size] ?? 0;

                return ListTile(
                  title: Text("Tamanho $size"),
                  subtitle: Text("R\$ ${price.toStringAsFixed(2)}"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(icon: Icon(Icons.remove), onPressed: () {
                        setState(() { if(qty > 0) selectedQuantities[size] = qty - 1; });
                      }),
                      Text("$qty", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      IconButton(icon: Icon(Icons.add), onPressed: () {
                        setState(() { selectedQuantities[size] = qty + 1; });
                      }),
                    ],
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(minimumSize: Size(double.infinity, 50)),
              onPressed: () {
                final cart = Provider.of<CartProvider>(context, listen: false);
                bool added = false;

                selectedQuantities.forEach((size, qty) {
                  if (qty > 0) {
                    double price = widget.variants.firstWhere((v) => v['size'] == size)['price'];
                    cart.addItem("${widget.productCode}_$size", widget.productName, size, price, qty);
                    added = true;
                  }
                });

                if (added) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Adicionado ao carrinho!")));
                }
              },
              child: Text("ADICIONAR AO CARRINHO"),
            ),
          ),
        ],
      ),
    );
  }
}