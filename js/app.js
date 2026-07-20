class CalculadoraDiscos {
    constructor() {
        // 1. Referencias a elementos del DOM
        this.form = document.getElementById('form-calculo');
        this.inputPeso = document.getElementById('pesoDisco');
        this.contenedorResultado = document.getElementById('resultado-contenido');
        
        // Referencias a las vistas (pantallas)
        this.vistaInicio = document.getElementById('vista-inicio');
        this.vistaResultados = document.getElementById('vista-resultados');
        this.vistaCreditos = document.getElementById('vista-creditos');

        // Referencias a botones de navegación
        this.btnCreditos = document.getElementById('btn-ir-creditos');
        this.btnRegresar = document.getElementById('btn-regresar');
        this.btnRegresarCreditos = document.getElementById('btn-regresar-creditos');

        // 2. Inicializar eventos
        this.inicializarEventos();
    }

    inicializarEventos() {
        // Al enviar el formulario, interceptamos y calculamos
        this.form.addEventListener('submit', (evento) => {
            evento.preventDefault(); // Evita que la página se recargue
            this.procesarCalculo();
        });

        // Navegación entre vistas
        this.btnCreditos.addEventListener('click', () => this.cambiarVista('creditos'));
        this.btnRegresar.addEventListener('click', () => this.cambiarVista('inicio'));
        this.btnRegresarCreditos.addEventListener('click', () => this.cambiarVista('inicio'));
    }

    procesarCalculo() {
        const pesoStr = this.inputPeso.value.trim();
        const peso = parseFloat(pesoStr);

        // Validaciones
        if (peso === 0 || pesoStr === ''){
            this.mostrarError('¿Un disco de 0 kg? Para levantar aire no necesitas cemento.');
            return;
        }
        if (isNaN(peso)) {
            this.mostrarError('Eso no es un número. Pixelman no sabe leer jeroglíficos.');
            return;
        }

        if (peso < 0) {
            this.mostrarError('¿Pesos negativos? Ni que estuviéramos entrenando en el espacio.');
            return;
        }
        if (peso > 500) {
            this.mostrarError('Mas de 500 kg... ¿Vas a entrenar tú o Hulk?');
            return;
        }

        // Cálculos de la mezcla
        const pArena = peso * 0.4629;
        const pCemento = peso * 0.1364;
        const pPiedras = peso * 0.3224;
        const pesoAgua = peso * 0.7850;
        const mF = (pPiedras / pArena).toFixed(4);

        // Generar el HTML del resultado
        const htmlResultado = `
            <strong>RECETA PARA TU DISCO DE ${peso} KG</strong><br>
            Arena = ${pArena.toFixed(2)} kg <br>
            Cemento = ${pCemento.toFixed(2)} kg <br>
            Piedras = ${pPiedras.toFixed(2)} kg <br>
            Agua = ${pesoAgua.toFixed(2)} lt <br>
            <hr style="border: 0.1px solid #444; margin: 10px 0;">
            Módulo de Finura = ${mF}
        `;

        // Inyectar y mostrar
        this.contenedorResultado.innerHTML = htmlResultado;
        this.cambiarVista('resultados');
    }

    mostrarError(mensaje) {
        this.contenedorResultado.innerHTML = `<span class="error-msg">${mensaje}</span>`;
        this.cambiarVista('resultados');
    }

    cambiarVista(nombreVista) {
        // 1. Ocultar todas las vistas
        this.vistaInicio.classList.remove('activa');
        this.vistaResultados.classList.remove('activa');
        this.vistaCreditos.classList.remove('activa');

        // 2. Mostrar solo la solicitada
        if (nombreVista === 'inicio') {
            this.vistaInicio.classList.add('activa');
            this.inputPeso.value = ''; // Limpiar input al volver
            this.inputPeso.focus();
        } else if (nombreVista === 'resultados') {
            this.vistaResultados.classList.add('activa');
        } else if (nombreVista === 'creditos') {
            this.vistaCreditos.classList.add('activa');
        }
    }
}

// Iniciar la aplicación cuando el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const app = new CalculadoraDiscos();
});