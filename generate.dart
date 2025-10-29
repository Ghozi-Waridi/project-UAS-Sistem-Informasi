import 'dart:io';

void main(List<String> args) {
  // === Validasi input ===
  if (args.isEmpty) {
    print(
      '❌ Masukkan nama feature. Contoh: dart run tools/make_feature.dart home',
    );
    exit(1);
  }

  final featureName = args.first.toLowerCase();
  final className = featureName[0].toUpperCase() + featureName.substring(1);
  final basePath = 'lib/app/features/$featureName';

  // === Cek apakah feature sudah ada ===
  final featureDir = Directory(basePath);
  if (featureDir.existsSync()) {
    print(
      '⚠️  Feature "$featureName" sudah ada di $basePath. Tidak dibuat ulang.',
    );
    exit(0);
  }

  // === Buat struktur folder ===
  print('📦 Membuat feature baru: $featureName');
  final folders = ['controllers', 'views', 'models'];

  for (final folder in folders) {
    final dir = Directory('$basePath/$folder');
    dir.createSync(recursive: true);
    print('  📁 Folder dibuat: ${dir.path}');
  }

  // === File Controller ===
  final controllerFile = File(
    '$basePath/controllers/${featureName}_controller.dart',
  );
  controllerFile.writeAsStringSync('''
import 'package:get/get.dart';

class ${className}Controller extends GetxController {
  var counter = 0.obs;
  void increment() => counter++;
}
''');

  // === File Model ===
  final modelFile = File('$basePath/models/${featureName}_model.dart');
  modelFile.writeAsStringSync('''
class ${className}Model {
  // Tambahkan properti model di sini
}
''');

  // === File View ===
  final viewFile = File('$basePath/views/${featureName}_view.dart');
  viewFile.writeAsStringSync('''
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/${featureName}_controller.dart';

class ${className}View extends GetView<${className}Controller> {
  const ${className}View({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('$className Page')),
      body: Center(
        child: Obx(() => Text(
          'Counter: \${controller.counter}',
          style: const TextStyle(fontSize: 24),
        )),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: controller.increment,
        child: const Icon(Icons.add),
      ),
    );
  }
}
''');

  print('\n✅ Feature "$featureName" berhasil dibuat di $basePath');
}
