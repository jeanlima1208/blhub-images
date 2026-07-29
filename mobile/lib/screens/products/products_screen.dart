import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../models/item.dart';
import '../../api/item_service.dart';
import '../../providers/cart_provider.dart';
import 'cart_screen.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({Key? key}) : super(key: key);

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  String _selectedTeam = 'TODOS';
  String _selectedSize = 'TODOS';
  bool _onlyWithStock = false;
  String _searchQuery = '';

  final FocusNode _searchFocusNode = FocusNode();
  final TextEditingController _searchController = TextEditingController();

  late Future<List<Item>> _productsFuture;

  List<String> _dynamicTeamsList = ['TODOS'];
  List<Item> _allItems = [];

  final List<String> _sizesDropdownList = [
    'TODOS', 'P', 'M', 'G', 'GG', 'G1', 'G2', 'G3', 'XXG'
  ];

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  void _loadProducts() {
    setState(() {
      _productsFuture = ItemService.getTemplates().then((items) {
        _allItems = items;
        _updateTeamsList();
        return items;
      });
    });
  }

  void _updateTeamsList() {
    final Set<String> extractedTeams = {'TODOS'};
    for (final item in _allItems) {
      if (item.name.trim().isNotEmpty) {
        final firstWord = item.name.trim().split(' ').first.toUpperCase();
        extractedTeams.add(firstWord);
      }
    }
    _dynamicTeamsList = extractedTeams.toList()..sort((a, b) {
      if (a == 'TODOS') return -1;
      if (b == 'TODOS') return 1;
      return a.compareTo(b);
    });
  }

  List<Item> _getFilteredItems() {
    return _allItems.where((item) {
      try {
        final itemNameUpper = item.name.toUpperCase();
        final itemCodeUpper = item.code.toUpperCase();
        final searchUpper = _searchQuery.toUpperCase();

        final matchesSearch = _searchQuery.isEmpty ||
            itemNameUpper.contains(searchUpper) ||
            itemCodeUpper.contains(searchUpper);

        final itemFirstWord = item.name.trim().isEmpty
            ? 'OUTROS'
            : item.name.trim().split(' ').first.toUpperCase();

        final matchesTeam = _selectedTeam == 'TODOS' || itemFirstWord == _selectedTeam;

        bool matchesSize = false;
        bool matchesStock = true;

        if (_selectedSize == 'TODOS') {
          matchesSize = true;
          if (_onlyWithStock) matchesStock = item.stock > 0;
        } else {
          final String targetSize = _selectedSize.toUpperCase();
          final bool hasSizeWithStock = item.availableSizes.contains(targetSize);
          final bool hasSizeWithoutStock = item.availableSizes.contains("$targetSize|ZERADO");

          matchesSize = hasSizeWithStock || hasSizeWithoutStock;
          if (_onlyWithStock) matchesStock = hasSizeWithStock;
        }

        return matchesSearch && matchesTeam && matchesSize && matchesStock;
      } catch (e) {
        return false;
      }
    }).toList();
  }

  @override
  void dispose() {
    _searchFocusNode.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const Color darkBgColor = Color(0xFF0F1115);
    const Color cardBgColor = Color(0xFF161920);
    const Color neonYellow = Color(0xFFFFEA00);
    const Color neonGreen = Color(0xFF00FF66);
    const Color textPrimary = Colors.white;
    const Color textSecondary = Color(0xFF94A3B8);

    return Scaffold(
      backgroundColor: darkBgColor,
      appBar: AppBar(
        title: const Text('Estoque BLHub', style: TextStyle(fontWeight: FontWeight.bold, color: neonYellow, letterSpacing: 1.2)),
        centerTitle: true,
        backgroundColor: darkBgColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: FutureBuilder<List<Item>>(
        future: _productsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: neonGreen));
          }

          if (snapshot.hasError) {
            return const Center(child: Text('Erro ao carregar o estoque.', style: TextStyle(color: textPrimary)));
          }

          final filteredItems = _getFilteredItems();

          return Column(
            children: [
              _buildFilterSection(cardBgColor, darkBgColor, neonGreen, neonYellow, textPrimary, textSecondary),
              Expanded(
                child: filteredItems.isEmpty
                    ? _buildEmptyState(textSecondary)
                    : _buildGrid(filteredItems, cardBgColor, neonGreen, darkBgColor, textPrimary, textSecondary, neonYellow),
              ),
            ],
          );
        },
      ),
      // Botão flutuante do carrinho reativado
      floatingActionButton: Consumer<CartProvider>(
        builder: (context, cart, child) {
          int totalItems = cart.items.values.fold(0, (sum, item) => sum + item.quantity);
          if (totalItems == 0) return const SizedBox.shrink();
          
          return FloatingActionButton(
            backgroundColor: neonGreen,
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const CartScreen())),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.shopping_cart, color: Colors.black),
                Positioned(
                  right: -6, top: -6,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                    constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                    child: Text('$totalItems', style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFilterSection(Color cardBg, Color darkBg, Color neonGreen, Color neonYellow, Color textPrimary, Color textSecondary) {
    return Container(
      width: double.infinity,
      color: cardBg,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          TextField(
            controller: _searchController,
            onChanged: (val) => setState(() => _searchQuery = val),
            style: TextStyle(color: textPrimary),
            decoration: InputDecoration(
              hintText: 'Pesquisar camisa ou código...',
              hintStyle: TextStyle(color: textSecondary),
              prefixIcon: Icon(Icons.search, color: neonGreen),
              filled: true,
              fillColor: darkBg,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildDropdown('Time / Seleção', _selectedTeam, _dynamicTeamsList, (val) => setState(() => _selectedTeam = val!)),
              const SizedBox(width: 12),
              _buildDropdown('Tamanho', _selectedSize, _sizesDropdownList, (val) => setState(() => _selectedSize = val!)),
            ],
          ),
          CheckboxListTile(
            value: _onlyWithStock,
            title: Text('Apenas itens com estoque', style: TextStyle(fontSize: 13, color: textPrimary)),
            contentPadding: EdgeInsets.zero,
            controlAffinity: ListTileControlAffinity.leading,
            activeColor: neonGreen,
            onChanged: (val) => setState(() => _onlyWithStock = val!),
          ),
        ],
      ),
    );
  }

  Widget _buildDropdown(String label, String value, List<String> items, Function(String?) onChanged) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF00FF66), fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(color: const Color(0xFF0F1115), borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.white10)),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: value,
                dropdownColor: const Color(0xFF161920),
                isExpanded: true,
                style: const TextStyle(color: Colors.white),
                items: items.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                onChanged: onChanged,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGrid(List<Item> items, Color cardBg, Color neonGreen, Color darkBg, Color textPrimary, Color textSecondary, Color neonYellow) {
    return GridView.builder(
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(maxCrossAxisExtent: 180, childAspectRatio: 0.65, crossAxisSpacing: 12, mainAxisSpacing: 12),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final product = items[index];
        final hasStock = product.stock > 0;
        return Container(
          decoration: BoxDecoration(color: cardBg, borderRadius: BorderRadius.circular(16), border: Border.all(color: hasStock ? neonGreen.withOpacity(0.15) : Colors.redAccent.withOpacity(0.15))),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: InkWell(
                  onTap: () => _showVariantsModal(context, product, neonGreen, darkBg, cardBg, textPrimary, textSecondary, neonYellow),
                  child: Container(
                    width: double.infinity,
                    color: darkBg.withOpacity(0.5),
                    child: product.image != null && product.image!.isNotEmpty
                        ? Image.network(product.image!, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.checkroom, color: Colors.grey))
                        : const Icon(Icons.checkroom, color: Colors.grey),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.name, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                    Text(product.code, style: const TextStyle(color: Colors.grey, fontSize: 11)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: (hasStock ? neonGreen : Colors.redAccent).withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                      child: Text(hasStock ? '${product.stock} un' : 'Esgotado', style: TextStyle(color: hasStock ? neonGreen : Colors.redAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildEmptyState(Color textSecondary) {
    return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.inventory_2_outlined, size: 64, color: textSecondary), const SizedBox(height: 16), Text('Nenhum produto encontrado.', style: TextStyle(color: textSecondary))]));
  }

  void _showVariantsModal(BuildContext context, Item product, Color neonGreen, Color darkBgColor, Color cardBgColor, Color textPrimary, Color textSecondary, Color neonYellow) {
    showModalBottomSheet(
      context: context,
      backgroundColor: cardBgColor,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      isScrollControlled: true,
      builder: (context) {
        final bool hasImage = product.image != null && product.image!.isNotEmpty;
        return Container(
          padding: const EdgeInsets.all(20),
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.7),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: textSecondary.withOpacity(0.4), borderRadius: BorderRadius.circular(2)))),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(product.name, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textPrimary)), Text('Código: ${product.code}', style: TextStyle(color: textSecondary))])),
                  Row(children: [
                    if (hasImage) IconButton(icon: const Icon(Icons.delete_forever, color: Colors.redAccent), onPressed: () async {
                      await ItemService.removeImage(product.code);
                      if (context.mounted) { Navigator.pop(context); _loadProducts(); }
                    }),
                    IconButton(icon: Icon(Icons.add_a_photo, color: neonGreen), onPressed: () async {
                      final XFile? image = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 85);
                      if (image != null) {
                        await ItemService.uploadImage(product.code, await image.readAsBytes(), image.name);
                        if (context.mounted) { Navigator.pop(context); _loadProducts(); }
                      }
                    }),
                  ]),
                ],
              ),
              const Divider(color: Colors.white10),
              Flexible(
                child: FutureBuilder<List<Item>>(
                  future: ItemService.getVariantsOf(product.code),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) return Center(child: CircularProgressIndicator(color: neonGreen));
                    final variants = snapshot.data ?? [];
                    return ListView.separated(
                      shrinkWrap: true,
                      itemCount: variants.length,
                      separatorBuilder: (_, __) => const Divider(height: 1, color: Colors.white10),
                      itemBuilder: (context, idx) {
                        final v = variants[idx];
                        int quantity = 1; // Contador local

                        // FALLBACK DE PREÇO: Se o preço do item variant for nulo ou 0.0, usa o do item pai
                        final double finalPrice = (v.price != null && v.price > 0.0) ? v.price : product.price;

                        return StatefulBuilder(
                          builder: (context, setRowState) {
                            return ListTile(
                              title: Text(v.name, style: TextStyle(color: textPrimary)),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: 4),
                                  Text('R\$ ${finalPrice.toStringAsFixed(2)}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                                  const SizedBox(height: 2),
                                  Text('Estoque: ${v.stock}', style: TextStyle(color: v.stock > 0 ? neonGreen : Colors.redAccent, fontSize: 12)),
                                ],
                              ),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.remove, color: Colors.white70, size: 20),
                                    onPressed: quantity > 1 ? () => setRowState(() => quantity--) : null,
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(color: darkBgColor, borderRadius: BorderRadius.circular(4)),
                                    child: Text('$quantity', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.add, color: Colors.white70, size: 20),
                                    onPressed: quantity < v.stock ? () => setRowState(() => quantity++) : null,
                                  ),
                                  const SizedBox(width: 10),
                                  IconButton(
                                    icon: Icon(Icons.add_shopping_cart, color: v.stock > 0 ? neonGreen : Colors.grey),
                                    onPressed: v.stock > 0 ? () {
                                      // Enviando o preço correto calculado acima para o carrinho
                                      Provider.of<CartProvider>(context, listen: false).addItem(
                                        v.code, product.name, v.name, finalPrice, quantity
                                      );
                                      Navigator.pop(context);
                                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('${v.name} adicionado!'), backgroundColor: neonGreen));
                                    } : null,
                                  ),
                                ],
                              ),
                            );
                          },
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}