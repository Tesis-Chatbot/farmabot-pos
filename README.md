# Farmabot POS

Sistema de Punto de Venta (POS) desarrollado en React para la gestión de ventas, dispensación de medicamentos y atención al cliente. Este proyecto forma parte de la tesis: "Chatbot Integrado al Punto de Venta para Optimización de la Atención y Automatización de Procesos en Farmacias".

## Características
- Búsqueda Dinámica: Filtrado de medicamentos por nombre, laboratorio o código de barras en tiempo real.
- Gestión de Carrito: Hook personalizado (useCart) para el manejo de estado, cálculos de totales y persistencia.
- Validación de Lealtad: Integración con sistema de tarjetas de beneficios (14 dígitos).
- Diseño Responsivo: Interfaz moderna construida con Tailwind CSS.
-Integración: Comunicación asíncrona con el backend (FastAPI) para sincronización de stock.

## Tecnologías Utilizadas
- Frontend: React.js + Vite
- Estilos: Tailwind CSS
- Iconos: Lucide React
- Estado: React Hooks (Custom Hooks)

## Conectividad
Este frontend requiere que el repositorio farmabot-backend esté en ejecución para procesar las ventas y consultar el inventario.

## Autor
Leonardo Pantoja Canchola - Ingeniería de Software - Matrícula: 214960
