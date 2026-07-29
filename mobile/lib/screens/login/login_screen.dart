import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // CORES VERDE E AMARELO NEON
  final Color darkBgColor = const Color(0xFF0F1115);     
  final Color cardBgColor = const Color(0xFF161920);     
  final Color neonYellow = const Color(0xFFFFEA00);      
  final Color neonGreen = const Color(0xFF00FF66);       
  final Color textSecondary = const Color(0xFF94A3B8);   

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: darkBgColor,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(32.0),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: cardBgColor,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: neonGreen.withOpacity(0.2), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: neonGreen.withOpacity(0.05),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                )
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // LOGO OFICIAL AMPLIADO E EM DESTAQUE
                Container(
                  margin: const EdgeInsets.only(bottom: 20),
                  width: 180,  // Força uma largura maior para a imagem
                  height: 180, // Força uma altura maior para a imagem
                  constraints: const BoxConstraints(
                    maxHeight: 200, // Limite máximo expandido
                    maxWidth: 300,  
                  ),
                  decoration: BoxDecoration(
                    // Brilho neon de fundo ligeiramente mais forte para acompanhar o tamanho
                    boxShadow: [
                      BoxShadow(
                        color: neonYellow.withOpacity(0.2),
                        blurRadius: 40,
                        spreadRadius: 8,
                      )
                    ],
                  ),
                  child: Image.asset(
                    'assets/images/logo.png',
                    fit: BoxFit.contain, // Garante que não vai cortar nenhuma borda do escudo
                    errorBuilder: (context, error, stackTrace) {
                      return Icon(Icons.bolt, size: 80, color: neonYellow);
                    },
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'BLHub',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 2.0,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'SISTEMA DE GESTÃO DE ESTOQUE',
                  style: TextStyle(
                    fontSize: 11, 
                    color: neonGreen, 
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                  ),
                ),
                const SizedBox(height: 32),
                
                // CAMPO USUÁRIO
                TextField(
                  controller: _emailController,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Usuário ou E-mail',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: Icon(Icons.person_outline, color: neonGreen),
                    filled: true,
                    fillColor: darkBgColor,
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: neonGreen, width: 1.5),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // CAMPO SENHA
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Senha secreta',
                    hintStyle: TextStyle(color: textSecondary),
                    prefixIcon: Icon(Icons.lock_outline, color: neonGreen),
                    filled: true,
                    fillColor: darkBgColor,
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: neonGreen, width: 1.5),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                
                // BOTÃO ENTRAR
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacementNamed(context, '/dashboard');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: neonYellow,
                      foregroundColor: darkBgColor,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 5,
                      shadowColor: neonYellow.withOpacity(0.4),
                    ),
                    child: const Text(
                      'ACESSAR PAINEL',
                      style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2, fontSize: 14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}