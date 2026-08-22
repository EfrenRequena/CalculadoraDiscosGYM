/* ========================================
    APLICACIÓN PRINCIPAL - CALCULADORA DE DISCOS
   ========================================
   Autor: [Tu nombre]
   Descripción: Calculadora de dosificación de concreto
   para discos de pesas, con visualizador 3D isométrico
   y sistema de navegación SPA (Single Page Application).
   ======================================== */


/* ========================================
    CLASE PRINCIPAL: CalculadoraDiscos
   ----------------------------------------
   Encapsula TODA la lógica de la app:
   - Captura de datos del formulario
   - Cálculo de dosificación de concreto
   - Navegación entre vistas (SPA)
   - Generación del molde 3D dinámico
   ======================================== */

class CalculadoraDiscos {
    /* ========================================
        CONSTRUCTOR
       ----------------------------------------
       Se ejecuta al crear la instancia.
       Carga referencias al DOM y arranca eventos.
       ======================================== */
    constructor() {
        // 1. Referencias a elementos del DOM
        this.form = document.getElementById('form-calculo');
        this.inputPeso = document.getElementById('pesoDisco');
        this.contenedorResultado = document.getElementById('resultado-contenido');
        
        this.moldeContainer = document.querySelector('.molde-container');

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

    /* ========================================
        INICIALIZAR EVENTOS
       ----------------------------------------
       Conecta los botones y formularios con
       sus funciones correspondientes.
       ======================================== */
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

    /* ========================================
        PROCESAR CÁLCULO (LÓGICA PRINCIPAL)
       ----------------------------------------
       Valida el peso ingresado, calcula la
       dosificación de materiales y muestra
       los resultados + el molde 3D.
       ======================================== */
    procesarCalculo() {
        const pesoStr = this.inputPeso.value.trim();
        const pesoTotal = parseFloat(pesoStr);

        // Validaciones iniciales
        if (pesoTotal === 0 || pesoStr === ''){
            this.mostrarError('¿Un disco de 0 kg? Para levantar aire no necesitas cemento.');
            return;
        }
        if (isNaN(pesoTotal)) {
            this.mostrarError('Eso no es un número. Pixelman no sabe leer jeroglíficos.');
            return;
        }
        if (pesoTotal < 0) {
            this.mostrarError('¿Pesos negativos? Ni que estuviéramos entrenando en el espacio.');
            return;
        }
        if (pesoTotal > 500) {
            this.mostrarError('Mas de 500 kg... ¿Vas a entrenar tú o Hulk?');
            return;
        }

        // --- PUNTO 4: Control del Agarre ---
        // Buscamos si existe un input para el agarradero, si no, asumimos 0 kg.
        const inputAgarradero = document.getElementById('pesoAgarradero');
        const pesoAgarradero = inputAgarradero && inputAgarradero.value ? parseFloat(inputAgarradero.value) : 0;
        
        // Peso neto de puro concreto
        const pesoConcreto = pesoTotal - pesoAgarradero;

        if (pesoConcreto <= 0) {
            this.mostrarError('El peso del disco debe ser mayor al peso del agarradero.');
            return;
        }

        //1&2 - Dosificación Base por Litro ---
        const densidadConcreto = 2.35; // kg/litro
        const dosisCemento = 0.33;     // kg
        const dosisArena = 1.12;       // kg
        const dosisPiedra = 0.78;      // kg
        const dosisAgua = 0.19;        // litros

        // 3- Factor multiplicador (Veces la dosis) ---
        const factor = pesoConcreto / densidadConcreto;

        // Escalado de materiales según el factor
        const pCemento = dosisCemento * factor;
        const pArena = dosisArena * factor;
        const pPiedras = dosisPiedra * factor;
        const pAgua = dosisAgua * factor;



        // Generar el HTML del resultado
        const htmlResultado = `
            <strong>RECETA PARA DISCO DE ${pesoTotal} KG</strong><br>
            Arena = ${pArena.toFixed(2)} kg <br>
            Cemento = ${pCemento.toFixed(2)} kg <br>
            Piedras = ${pPiedras.toFixed(2)} kg <br>
            Agua = ${pAgua.toFixed(2)} lt <br>
            <hr style="border: 0.1px solid #444; margin: 10px 0;">

        `;

        if (this.moldeContainer) {
            this.moldeContainer.style.display = 'block'; 
        }

        // Pasamos el peso neto al generador del molde 3D para que el tamaño sea exacto
        this.actualizarMoldeVisual(pesoConcreto);
        this.contenedorResultado.innerHTML = htmlResultado;
        this.cambiarVista('resultados');
    }

        /* ========================================
        MOSTRAR ERROR
       ----------------------------------------
       Muestra un mensaje de error en la vista
       de resultados y oculta el molde 3D.
       ======================================== */

    mostrarError(mensaje) {
        this.contenedorResultado.innerHTML = `<span class="error-msg">${mensaje}</span>`;
        this.cambiarVista('resultados');

        if (this.moldeContainer) {
            this.moldeContainer.style.display = 'none';
        }

        this.cambiarVista('resultados');
    }

    /* ========================================
        CAMBIAR VISTA (SISTEMA SPA)
       ----------------------------------------
       Controla qué pantalla se muestra.
       Quita la clase "activa" a todas y la
       añade solo a la vista solicitada.
       ======================================== */

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

    /* ========================================
        ACTUALIZAR MOLDE VISUAL (3D)
       ----------------------------------------
       Calcula las dimensiones REALES del disco
       usando Newton-Raphson y genera las capas
       CSS apiladas para simular un disco 3D.
       ======================================== */

        actualizarMoldeVisual(peso) {
        // 1. Densidad del concreto fraguado promedio: 2.4 kg por dm³ (Litro)
        const densidadConcreto = 2.35; // Ahora coincide con los 2350 kg/m3 del diseño de mezcla
        const volumenTotal = peso / densidadConcreto; // dm³

        // 2. Geometría real del hueco (Tubo de PVC de 2" para barra olímpica = 50.8mm)
        const diametroHuecoMM = 50.8;
        const r_hueco_dm = (diametroHuecoMM / 100) / 2; // radio interno en dm

        // 3. Resolución matemática del Diámetro (D) por Método de Newton-Raphson
        // Ecuación a resolver: D^3 - 4(r^2)D - (24 * Volumen / PI) = 0
        const A = (24 * volumenTotal) / Math.PI;
        const B = 4 * Math.pow(r_hueco_dm, 2);

        let D = Math.cbrt(A); // Estimación inicial base
        for (let i = 0; i < 10; i++) {
            let f = Math.pow(D, 3) - (B * D) - A;
            let df = 3 * Math.pow(D, 2) - B;
            D = D - (f / df);
        }

        const diametroDM = D;
        const grosorDM = diametroDM / 6;

        // 4. Convertir a milímetros
        const diametroRealMM = diametroDM * 100;
        const grosorRealMM = grosorDM * 100;

        // 5. Escalar para renderizado en pantalla (Máximo ~240px de tamaño)
        const maxVisual = 240;
        // Evitamos que discos muy grandes desborden la pantalla
        let factorEscala = maxVisual / Math.max(diametroRealMM, 150); 
        
        let diametroVisual = diametroRealMM * factorEscala;
        let grosorVisual = Math.round(grosorRealMM * factorEscala);
        let radioHuecoVisual = (diametroHuecoMM / 2) * factorEscala;

        // 6. Manipulación del DOM para el efecto 3D Stacked
        const disco = document.getElementById('disco-3d');
        if (disco) {
            disco.style.setProperty('--diametro', diametroVisual);
            disco.style.setProperty('--grosor', grosorVisual);
            disco.style.setProperty('--radio-hueco', radioHuecoVisual);

            // Generamos N capas para simular el cuerpo sólido con un hueco pasante
            let capasHTML = '';
            for (let i = 0; i < grosorVisual; i++) {
                // translateZ apila cada div 1px más abajo
                const z = -i; 
                // Oscurecemos las capas inferiores simulando sombreado natural
                const brillo = 1 - (i / grosorVisual) * 0.45;
                
                let clases = 'capa-disco';
                if (i === 0) clases += ' capa-top';
                if (i === grosorVisual - 1) clases += ' capa-bottom';

                capasHTML += `<div class="${clases}" style="transform: translateZ(${z}px); filter: brightness(${brillo});"></div>`;
            }
            disco.innerHTML = capasHTML;
        }

        // 7. Mostrar resultados físicos
        const datoDiametro = document.getElementById('dato-diametro');
        const datoGrosor = document.getElementById('dato-grosor');
        
        if (datoDiametro) datoDiametro.textContent = diametroRealMM.toFixed(1);
        if (datoGrosor) datoGrosor.textContent = grosorRealMM.toFixed(1);
    }
}
/* ========================================
    SISTEMA DE CONSEJOS ALEATORIOS (MARQUESINA)
   ----------------------------------------
   Array con frases motivacionales/técnicas.
   Se muestra una al azar y cambia cada vez
   que la animación de la marquesina termina.
   ======================================== */
    const listaConsejos = [
        "CONSEJO: Deja curar el concreto a la sombra para evitar grietas.",
        "CONSEJO: La técnica siempre es más importante que el peso levantado.",
        "CONSEJO: Vibra bien el molde golpeando los lados para eliminar burbujas de aire.",
        "CONSEJO: Pon a sonar un buen metal de fondo para los levantamientos pesados.",
        "CONSEJO: Respeta los días de descanso, el músculo crece mientras duermes.",
        "CONSEJO: Usa aceite o desmoldante en el borde interior para sacar el disco fácil.",
        "CONSEJO: Un disco bien hecho te durará años de entrenamiento continuo."
    ];

    const tickerElement = document.getElementById('texto-consejo');

    if (tickerElement) {
        // 1. Mostrar un consejo aleatorio apenas cargue
        tickerElement.textContent = listaConsejos[Math.floor(Math.random() * listaConsejos.length)];

        // 2. Escuchar cuándo termina la animación (cuando el texto ya salió por la izquierda)
        tickerElement.addEventListener('animationiteration', () => {
            // Seleccionar un nuevo consejo aleatorio
            const consejoAleatorio = listaConsejos[Math.floor(Math.random() * listaConsejos.length)];
            
            // Cambiar el texto (el usuario no lo notará porque en este punto está fuera de pantalla)
            tickerElement.textContent = consejoAleatorio;
        });
    }

// Iniciar la aplicación cuando el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const app = new CalculadoraDiscos();
});
