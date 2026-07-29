import 'package:flutter/material.dart';
import '../../services/session_service.dart';
import '../dashboard/dashboard_screen.dart';
import '../login/login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    // Espera 2 segundos só para dar tempo de ver a logo/animação
    await Future.delayed(const Duration(seconds: 2));
    
    // Checa se tem sessão ativa
    final bool loggedIn = await SessionService.isLogged();

    if (!mounted) return;

    // Redireciona para a tela certa
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => loggedIn ? const DashboardScreen() : const LoginScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Um indicador de carregamento simples
            CircularProgressIndicator(),
            SizedBox(height: 20),
            Text(
              "Carregando BLHub...",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }
}