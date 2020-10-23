// const path = require('path')

const toCurrency = price => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(price)
}

const toDate = date => {
  return new Intl.DateTimeFormat('ru-RU', {
    date: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent)
})


const $card = document.querySelector('#card')

if ($card) {
  document.addEventListener('click', ev => {
    if (ev.target.classList.contains('js-remove')) {
      const id = ev.target.dataset.id

      fetch('/card/remove/' + id, {
        method: 'delete'
      }).then(res => res.json())
        .then(card => {
          if (card.courses.length) {
            const html = card.courses.map(c => {
              return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button>
                                </td>
                            </tr>
                            `
            }).join('')
            $card.querySelector('tbody').innerHTML = html
            $card.querySelector('.price').innerHTML = toCurrency(card.price)
          } else {
            $card.innerHTML = '<p>Корзина пуста</p>'
          }
        })
    }
  })
}

const url = 'map/points'

if ($("table").is("#placesTable")) {
  $(document).ready(function () {
    $.getJSON(url, function (data) {
      var places_data = '';
      $.each(data.features, function (key, value) {
        places_data += '<tr>';
        places_data += '<td>' + value.properties.iconContent + '</td>';
        places_data += '<td>' + value.geometry.coordinates[0] + '</td>';
        places_data += '<td>' + value.geometry.coordinates[1] + '</td>';
        places_data += '<td>' +
          '<form action="/map/delete" method="POST"><input type="hidden" name="place" value=' + this.id + '><button type="submit" class="btn btn-primary">удалить</button></form>' +
          '<form action="/map/edit" method="POST"><input type="hidden" name="place" value=' + this.id + '><button type="submit" class="btn btn-primary">редактировать</button></form>' +
          '</td>';
        places_data += '</tr>';
      });
      $('#placesTable').append(places_data);
    })
  });
}


M.Tabs.init(document.querySelectorAll('.tabs'));


