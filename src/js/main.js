window.addEventListener('DOMContentLoaded', async function () {
    console.log('ok')

    //START filters
    const table__data = document.querySelector('.table__data')
    const title_res_apart = document.querySelector('.result__title .total_apart')
    const btn_res_apart = document.querySelector('.filters__btns .total_apart')
    const form = document.querySelector('.filters')
    const inputs = form.querySelectorAll('input')
    const result__data = document.querySelector('.result__data')
    const result__empty = document.querySelector('.result__empty')

    const data = await getData()
    let filterData = {}

    function init() {
        filterData = filter(data)
        btn_res_apart.innerHTML = filterData.length

        const html = filterData.map((el) => (template(el))).join(' ')
        render(html, filterData.length)
    }
    init()

    inputs.forEach((inp) => {
        inp.addEventListener('input', change)
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const html = filterData.map((el) => (template(el))).join(' ')
        render(html, filterData.length)
    })

    form.addEventListener('reset', (e) => {
        setTimeout(() => init())
    })

    function change() {
        filterData = filter(data)
        btn_res_apart.innerHTML = filterData.length
    }

    function filter(data) {
        const formData = new FormData(form)

        const price_from = +formData.get('price_from') || 0
        const price_to = +formData.get('price_to') || 999999999
        const area_from = +formData.get('area_from') || 0
        const area_to = +formData.get('area_to') || 1000
        const type = formData.getAll('type[]') || []

        return data.filter((el) => {
            return (price_from <= el.price && el.price <= price_to)
                && (area_from <= el.area && el.area <= area_to)
                && (type.length === 0 || type.includes(el.type))
        })
    }

    function template(data = {}) {
        return `<div class="table__row tab">
                    <div class="table__line">
                        <div class="table__td bold">${data.type}</div>
                        <div class="table__td">${data.floor}/${data.floor_max}</div>
                        <div class="table__td">${data.finish ? "Дом сдан" : data.finish_quarter + " кв. " + data.finish_year}</div>
                        <div class="table__td">${data.area} м²</div>
                        <div class="table__td bold">${data.price} ₽</div>
                        <div class="table__td icons">
                            <span><img src="./img/heart.svg" alt=""></span>
                            <span class="tabToggle"><img src="./img/arrow_bottom.svg" alt=""></span>
                        </div>
                    </div>
                    <div class="table__content">

                        <div class="marks">
                            <span class="mark mark_green mark_info">Скидка 2%</span>
                            <span class="mark mark_orange mark_info">Материнский капитал</span>
                            <span class="mark mark_violet">Ипотека от 0,1 %</span>
                        </div>
                        <div class="card-apart">
                            <div class="card-apart__img">
                                <img src="${data.img}" alt="${data.full_name}">
                            </div>
                            <div class="card-apart__content">
                                <div class="card-apart__title">${data.full_name}</div>
                                <div class="card-apart__tags">
                                    <div class="card-apart__tag">${data.price} ₽</div>
                                    <div class="card-apart__tag">${data.area} м²</div>
                                </div>
                                <div class="card-apart__details">
                                    <div class="card-apart__detail">
                                        <div class="card-apart__deatail-title">Цена за м²</div>
                                        <div class="card-apart__deatail-val">${Math.round(data.price / data.area)} ₽</div>
                                    </div>
                                    <div class="card-apart__detail">
                                        <div class="card-apart__deatail-title">Отделка</div>
                                        <div class="card-apart__deatail-val">${data.repair}</div>
                                    </div>
                                    <div class="card-apart__detail">
                                        <div class="card-apart__deatail-title">Корпус</div>
                                        <div class="card-apart__deatail-val">${data.corps}</div>
                                    </div>
                                </div>
                                <a class="card-apart__link" href="#">Подробное описание ></a>
                            </div>
                        </div>
                        <div class="callback">
                            <div class="callback__title">Хотите записаться на просмотр объекта?</div>
                            <div class="callback__desc">Оставьте свои данные, и мы организуем просмотр в удобное для вас время.</div>
                            <form class="callback__form">
                                <div class="callback__line">
                                    <div class="input-group">
                                        <label for="test">Имя</label>
                                        <input type="text" class="myInput" placeholder="Введите имя" id="test">
                                    </div>
                                    <div class="input-group">
                                        <label for="test">Номер телефона</label>
                                        <input type="text" class="myInput" placeholder="+ 7" id="test">
                                    </div>
                                    <button class="btn btn_yellow" type="submit">Оставить заявку</button>
                                </div>
                                <div class="callback__polit">Оставляя заявку вы соглашаетесь с <a href="#">политикой конфидециальности</a></div>
                            </form>
                        </div>

                    </div>
                </div>`
    }

    function render(html, len) {
        if (len) {
            table__data.innerHTML = html
            title_res_apart.innerHTML = len

            result__data.style.display = 'block'
            result__empty.style.display = 'none'
        } else {
            result__data.style.display = 'none'
            result__empty.style.display = 'flex'
        }

        
    }

    async function getData() {
        const res = await fetch('/resources/data.json')
        return await res.json()
    }
    //END filters



    //START tabs
    const tabs = document.querySelector('.tabs')

    tabs.addEventListener('click', (e) => {
        const toggleTarget = e.target.closest('.tabToggle')
        if (toggleTarget) {
            const tabTarget = e.target.closest('.tab')
            const tabOpen = tabs.querySelectorAll('.tab.open')

            toggleTarget.classList.toggle('rotate')

            tabTarget.classList.toggle('open')
            tabOpen.forEach((el) => {
                if (tabTarget !== el) {
                    el.classList.remove('open')
                    el.querySelector('.tabToggle').classList.remove('rotate')
                }
            })
        }
    })
    //END tabs



    //START inputs
    function inputFilters() {
        const inputFilters = document.querySelectorAll('.input-filters')

        inputFilters.forEach((el) => {
            const inputsContainer = el.querySelector('.input-filters__inputs')
            const inputs = el.querySelectorAll('input')

            inputsContainer.addEventListener('mouseenter', (e) => {
                inputs.forEach((el) => {
                    el.classList.add('hover')
                })
            })
            inputsContainer.addEventListener('mouseleave', (e) => {
                inputs.forEach((el) => {
                    el.classList.remove('hover')
                })
            })

            inputs.forEach((input) => {
                input.addEventListener('focus', (e) => {
                    inputs.forEach((el) => {
                        el.classList.add('active')
                    })
                })

                input.addEventListener('blur', (e) => {
                    inputs.forEach((el) => {
                        el.classList.remove('active')
                    })
                })
            })
        })
    }
    inputFilters()
    //END inputs
});