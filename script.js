const mensajeInformativo = document.getElementById('mensaje-informativo');
let timeoutId = null;

function toggleAprobado(element) {
    if (element.classList.contains('bloqueado')) {
        mostrarMensajeBloqueado(element);
        return; 
    }

    const yaEstabaAprobado = element.classList.contains("aprobado");
    element.classList.toggle("aprobado");

    if (!yaEstabaAprobado) {
        mostrarFelicitacion();
        animacionPop(element);
    }

    actualizarEstadoRamos();
}

function mostrarFelicitacion() {
    mensajeInformativo.textContent = "ENFASIS KL NETO";
    mensajeInformativo.className = 'mensaje-informativo visible felicitacion'; 

    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        mensajeInformativo.classList.remove('visible');
    }, 3000);
}

function mostrarMensajeBloqueado(element) {
    const requisitos = element.dataset.requisitos.split(',');
    const nombresRequisitos = [];

    requisitos.forEach(reqId => {
        const reqElemento = document.querySelector(`[data-id='${reqId}']`);
        if (reqElemento && !reqElemento.classList.contains('aprobado')) {
            nombresRequisitos.push(`"${reqElemento.textContent}"`);
        }
    });
    
    if (nombresRequisitos.length > 0) {
        mensajeInformativo.textContent = `⚠️ Aún te falta chakra para: ${nombresRequisitos.join(', ')}`;
        mensajeInformativo.className = 'mensaje-informativo visible error'; 

        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            mensajeInformativo.classList.remove('visible');
        }, 4000);
    }
}

function animacionPop(element) {
    element.style.animation = 'burst 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}

function actualizarEstadoRamos() {
    const todosLosRamos = document.querySelectorAll('.ramo');

    todosLosRamos.forEach(ramo => {
        const requisitos = ramo.dataset.requisitos;
        if (!requisitos) return; 

        const listaRequisitos = requisitos.split(',');
        let todosCumplidos = true;

        for (const reqId of listaRequisitos) {
            const reqElemento = document.querySelector(`[data-id='${reqId}']`);
            if (!reqElemento || !reqElemento.classList.contains('aprobado')) {
                todosCumplidos = false;
                break;
            }
        }

        if (todosCumplidos) {
            ramo.classList.remove('bloqueado');
        } else {
            ramo.classList.add('bloqueado');
            ramo.classList.remove('aprobado');
        }
    });

    guardarEstado();
}

function guardarEstado() {
    const estados = Array.from(document.querySelectorAll('.ramo')).map(div => ({
        id: div.dataset.id,
        aprobado: div.classList.contains('aprobado')
    }));
    localStorage.setItem('estadoRamosVicente', JSON.stringify(estados));
}

function cargarEstado() {
    const estados = JSON.parse(localStorage.getItem('estadoRamosVicente') || '[]');
    if (estados.length === 0) {
        actualizarEstadoRamos(); 
        return;
    }

    estados.forEach(estado => {
        const ramo = document.querySelector(`[data-id='${estado.id}']`);
        if (ramo && estado.aprobado) {
            ramo.classList.add('aprobado');
        }
    });

    actualizarEstadoRamos();
}

cargarEstado();
