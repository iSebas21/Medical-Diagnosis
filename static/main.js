'use strict'

window.addEventListener("load", () => {

    const contenedor = document.querySelector(".contenedor.form-container");
    code.getSymptoms(contenedor);
    code.loadButton(contenedor);

});

const code = {
    loadButton: contenedor => {
        const btn = contenedor.querySelector('#calcular');
        let activeButton = true;
        btn.addEventListener("click", async () => {
            if (activeButton) {
                const loading = document.querySelector("body .loading");
                contenedor.classList.add("disable");
                loading.classList.add("show");
                activeButton = false;
                const data = {
                    answers: [],
                    diseases: []
                };
                const sintomas = contenedor.querySelectorAll(".sintoma");
                sintomas.forEach(sintoma => {
                    data.answers.push({
                        question: sintoma.querySelector("p").innerHTML,
                        answer: sintoma.querySelector('input[type="range"]').value
                    });
                });
                const switchBtn = contenedor.querySelector('.enfermedades-container .switchBtn input[type="checkbox"]:checked');
                if (switchBtn) {
                    const diseases = contenedor.querySelectorAll('.enfermedades-container .enfermedades input[type="checkbox"]:checked');
                    diseases.forEach(disease => {
                        data.diseases.push({
                            name: contenedor.querySelector(`.enfermedades-container .enfermedades label[for="checkbox-${disease.value}"]`).innerHTML,
                            answer: disease.value
                        });
                    });
                }
                const results = await axios.post('./genresults', { data: data });
                const diseases = await axios.get('./enfermedades');
                setTimeout(() => {
                    code.loadDiseases(results.data.results, diseases.data);
                    loading.classList.remove("show");
                }, 3000);
            }
        });
    },
    getSymptoms: async contenedor => {
        const form = contenedor.querySelector(".form");
        const {
            data
        } = await axios.get('./sintomas');
        const enfermedades = (await axios.get('./enfermedades')).data.map(disease => disease.name);
        data.forEach(symptom => {
            form.append(code.genSlider(symptom));
        });
        form.append(code.genEnfermedades(enfermedades));
    },
    genSlider: symptom => {
        const div = document.createElement("div");
        div.classList.add("sintoma");
        div.innerHTML = `
            <p>${symptom}</p>
            <img src="" alt="">
            <div class="slider-container gray-flag">
                <div class="slider-deco ">
                    <div class="container">
                        <span class="value">0</span>
                    </div>
                </div>
                <input class="slider" type="range" min="0" max="1" step="0.1" value="0">
            </div>
        `;
        const slider = div.querySelector(".slider-container");
        code.loadDeco(slider);
        return div;
    },
    genEnfermedades: enfermedades => {
        const div = document.createElement("div");
        div.classList.add("enfermedades-container");
        div.innerHTML = `
        <label class="switchBtn">
            <input type="checkbox">
            <div class="slide round">Diagnostico Específico</div>
        </label>
        <div class="enfermedades"></div>
        `;
        //Add diseases
        const cont = div.querySelector(".enfermedades");
        enfermedades.forEach((enfermedad, i) => {
            cont.innerHTML += `
                <input type="checkbox" id="checkbox-${i}" value="${i}">
                <label for="checkbox-${i}">${enfermedad}</label>
            `;
        });
        const switchBtn = div.querySelector(".switchBtn input");
        switchBtn.addEventListener("change", () => {
            if (cont.classList.contains("show")) cont.classList.remove("show");
            else cont.classList.add("show");
        });
        return div;
    },
    loadDiseases: (rawResults, rawDiseases) => {
        const {results, diseases} = code.bubbleResults(rawResults, rawDiseases);
        const container = document.querySelector(".contenedor.info");
        diseases.forEach((disease, i) => {
            if(results[i] > 0) container.append(code.genTarjeta(disease));
        });
    },
    genTarjeta: data => {
        const { name, resumen, sintomas } = data;
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="space card text-white bg-dark mb-3 border-light mx-auto" style="max-width: 50rem;">
                <div class="card-body">
                    <h3 class="card-title">${name}</h5>
                    <h5 class="card-title">Resumen</h5>
                    <p class="card-text">${resumen}</p>
                    <h5 class="card-title">Sintomas</h5>
                    <p class="card-text">${sintomas}</p>
                </div>
            </div>
            `;
        return div;
    },
    loadDeco: slider => {
        const range = slider.querySelector('input[type="range"]');
        const rangeV = slider.querySelector('.slider-deco');
        const valueSpan = rangeV.querySelector('span.value');

        range.addEventListener('input', () => {
            const newValue = Number((range.value - range.min) * 100 / (range.max - range.min));
            const newPosition = 10 - (newValue * 0.2);
            switch (true) {
                case (range.value == 0):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "0";
                    break;
                case (range.value == 0.1):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "1";
                    break;
                case (range.value == 0.2):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "2";
                    break;
                case (range.value == 0.3):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "3";
                    break;
                case (range.value == 0.4):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "4";
                    break;
                case (range.value == 0.5):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "5";
                    break;
                case (range.value == 0.6):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "6";
                    break;
                case (range.value == 0.7):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "7";
                    break;
                case (range.value == 0.8):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "8";
                    break;
                case (range.value == 0.9):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "9";
                    break;
                case (range.value == 1):
                    slider.classList = "slider-container gray-flag";
                    valueSpan.innerHTML = "10";
                    break;

            }
            rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
        });

        range.addEventListener('mousedown', () => {


        });

    },
    bubbleResults: (inputArr, resultsArr) => {
        let len = inputArr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                if (inputArr[j] < inputArr[j + 1]) {
                    let tmp = inputArr[j];
                    inputArr[j] = inputArr[j + 1];
                    inputArr[j + 1] = tmp;
                    let tmp2 = resultsArr[j];
                    resultsArr[j] = resultsArr[j + 1];
                    resultsArr[j + 1] = tmp2;
                }
            }
        }
        return {
            results: inputArr,
            diseases: resultsArr
        };
    }
};

;