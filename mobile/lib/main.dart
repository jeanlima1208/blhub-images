import 'package:flutter/material.dart';
import 'package:provider/provider.dart'; // 1. Adicione este import
import 'providers/cart_provider.dart';   // 2. Certifique-se de importar seu provider
import 'screens/login/login_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/products/products_screen.dart';
import 'api/api_client.dart';
import 'screens/vendas/sales_history_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiClient.init();
  
  // 3. Envolva o app com o ChangeNotifierProvider
  runApp(
    ChangeNotifierProvider(
      create: (context) => CartProvider(),
      child: const BLHub(),
    ),
  );
}

class BLHub extends StatelessWidget {
  const BLHub({super.key});

  @override
  Widget build(BuildContext context) {
    const Color darkBgColor = Color(0xFF121214);
    const Color cardBgColor = Color(0xFF1E1E24);
    const Color neonPurple = Color(0xFFBB86FC);

    return MaterialApp(
      title: 'BLHub',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: darkBgColor,
        cardColor: cardBgColor,
        primaryColor: neonPurple,
        appBarTheme: const AppBarTheme(
          backgroundColor: darkBgColor,
          elevation: 0,
          centerTitle: true,
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/products': (context) => const ProductsScreen(),
        '/sales': (context) => const SalesHistoryScreen(),
      },
    );
  }
}