class Item {
  final String code;
  final String name;
  final String group;
  final String? image;
  int stock;
  int? actual_qty;
  List<String> availableSizes;
  double price; // <-- REMOVIDO O 'final' PARA PERMITIR INJETAR O PREÇO DE VENDA DO ERP

  Item({
    required this.code,
    required this.name,
    required this.group,
    this.image,
    required this.stock,
    this.actual_qty,
    this.availableSizes = const [],
    this.price = 0.0,
  });

  factory Item.fromJson(Map<String, dynamic> json) {
    // 1. Tenta pegar item_name primeiro, senão pega o name ou código
    String itemName = json['item_name']?.toString() ?? json['name']?.toString() ?? 'Sem Nome';
    
    // 2. Preço padrão
    var rawPrice = json['standard_rate'] ?? json['price'] ?? json['rate'] ?? 0;
    double parsedPrice = 0.0;
    if (rawPrice is num) {
      parsedPrice = rawPrice.toDouble();
    } else if (rawPrice is String) {
      parsedPrice = double.tryParse(rawPrice) ?? 0.0;
    }

    // 3. Estoque
    var rawStock = json['actual_qty'] ?? json['stock'] ?? json['qty'] ?? 0;
    int parsedStock = (rawStock is num) ? rawStock.toInt() : int.tryParse(rawStock.toString()) ?? 0;

    return Item(
      code: json['item_code']?.toString() ?? json['name']?.toString() ?? 'SEM_CODIGO',
      name: itemName, 
      group: json['item_group']?.toString() ?? 'CAMISAS',
      image: json['image'] != null && json['image'].toString().isNotEmpty 
             ? (json['image'].toString().startsWith('http') ? json['image'] : 'http://163.176.237.176${json['image']}') 
             : null,
      stock: parsedStock,
      actual_qty: parsedStock,
      availableSizes: [],
      price: parsedPrice,
    );
  }
}