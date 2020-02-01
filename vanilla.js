function next(elem, selector) {
	let sibling = elem.nextElementSibling;
	if (!selector) return sibling;
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.nextElementSibling
	}
};

document.addEventListener('DOMContentLoaded', () => {
    for (const select of document.querySelectorAll('select')) {
        select.classList.add('select-hidden')
    
        const wrapper = document.createElement('div')
        wrapper.classList.add('select')
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);
    
        const styledSelect = document.createElement('div');
        styledSelect.classList.add('select-styled')
        select.after(styledSelect)
    
        styledSelect.textContent = select.querySelector('option').textContent;
    
        const ul = document.createElement('ul');
        ul.classList.add('select-options')
        styledSelect.parentNode.insertBefore(ul, styledSelect.nextSibling)
    
        for (const option of select.querySelectorAll('option')) {
            const li = document.createElement('li');
            li.setAttribute('rel', option.value);
            li.textContent = option.textContent;
            ul.appendChild(li)
        }
    
        styledSelect.addEventListener("click", e => {
            e.stopPropagation()
            for (const elem of document.querySelectorAll('div.select-styled.active')) {
                if (elem === e.target) continue;
                elem.classList.remove('active');
                next(elem, 'ul.select-options').style.display = "none"
            }
            styledSelect.classList.toggle('active')

            let elem = next(styledSelect, 'ul.select-options');
            if (elem.style.display !== "none" && elem.style.display !== "") {
                elem.style.display = "none"
            } else {
                elem.style.display = "block"
            }
        })

        for (const li of ul.querySelectorAll('li')) {
            li.addEventListener('click', e => {
                e.stopPropagation();
                styledSelect.textContent = li.textContent;
                styledSelect.classList.remove('active');
                select.value = li.getAttribute('rel');
                ul.style.display = "none";
                localStorage.setItem("p", select.value);
            })
        }

        document.addEventListener('click', () => {
            styledSelect.classList.remove('active')
            ul.style.display = "none";
        })
    }
})

function go() {
    if (window.location.hash) {
        const query = window.location.hash.slice("#q=".length);
        if (localStorage.getItem("p") === null) {
            localStorage.setItem("p", 0.5);
        }
        const prob = parseFloat(localStorage.getItem("p"))
        const dest = (Math.random() > prob) ? `https://www.google.com/search?q=${query}` : `https://duckduckgo.com?q=${query}`;
        location.href = dest;
    }
}
document.addEventListener('DOMContentLoaded', go);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search').addEventListener('click', () => {
        const text = encodeURIComponent(document.getElementById('searchText').value);
        if (text.length === 0) return;

        window.location.hash = `#q=${text}`;
        go();
    })
})
