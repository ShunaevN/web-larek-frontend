# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack
Для сборки используется Webpack.

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

## Сборка

```
npm run build
```
## Архитектура проекта
Взаимодействия внутри приложения происходят через события, т.е. в основе приложения лежит событийно-ориентированный подход. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях. Проект выполнен в соответствие с паттерном MVP в объектно-ориентированном стиле. Приложение состоит из трех основных частей - данные, представление и презентер, который в данном случае не выделен в отдельную сущность, а его роль выполняет файл index.ts.

Слой модели отвечает за работу с данными - их получение, приведение к определенному типу и т.п.
Слой представления отвечает за отображение данных и работу с разметкой приложения.
Слой презентера отвечает за соединение модели и представления в единое целое для эффективного взаимодействия разных частей приложения.

Базовое взаимодейсвие частей в приложении можно описать следующим образом: index.ts является точкой сборки приложения и именно в нем происходит поиск шаблонов разметки и создание экземпляров классов. Создаются экземпляры по работе с бэкендом и экземпляр EventEmitter.  EventEmitter реализует паттерн наблюдатель и позволяет подписываться на события и уведомлять подписчиков о наступлении события. В index.ts происходит запрос к серверу на получение всех карточек и происходит рендеринг экземпляра класса Page  с отрисовкой основных компонентов - галереи товаров, счетчика корзины, товаров в корзине и блокировки страницы. Далее приложение по цепочке событий с помощью EventEmitter реализует логику поведения пользователя на странице, помогая взаимодействовать с основными компонентами приложения - формами, модальными окнами, страницей успешного выполнения заказа, корзиной. В случает успешного пользовательского сценария, карточки, добавленные в корзину совместно с контактными данными пользователя, платежной информацией и итоговой стоимостью покупки отправляются на сервер с помощью post запроса экземпляром класса ItemsAPI. 

## Ключевые интерфейсы и типы данных
Ключевые интерфейсы и типы данных находятся в папке types в файле index.ts. 
Кратко о каждом:
1. ***interface IItem*** - интерфейс одного товара в приложении. Сформирован на основе описания запроса к бэкенду
    ```
    interface IItem {
	id: string;
    description: string;
    image: string;
	title: string;
	category: string;
    price: number;
}```
2. interface ISuccess - интерфейс отображения итоговой суммы успешного заказа пользователем
    - interface IModalData - интерфейс для реализации модального окна
    - interface IFormState - интерфейс формы приложения как родительского классами
    - interface IContactForm - интерфейс конкретной формы - формы с контактами пользователя
    - interface IOrderForm - интерфейс конкретной формы - формы с данными о виде платежа и адресе
    - interface IOrder - позволяет сформировать интерфейс итогово заказа пользователя перед оплатой
    - interface IOrderSuccess - необходим для реализации успешного оплаченного заказа, где мы фиксируем себе айди заказа и итоговую стоимость
    - interface BasketView - интерфейс для отображения корзины с товарами и итоговой суммой
    - interface IAppState - интерфейс для глобального состояния нашего приложения
    - interface ICardActions - интерфейс для описания событий с карточками при клике
    - interface ICard - интерфейс отображения карточки. Некоторые поля выделены опциональными, так как состояния показа карточки разнятся на разных модальных окнах
    - interface IPage - отображения главной страницы приложения
    - interface IItemsAPI - интерфейс для описания взаимодействия с бэкендом и типизации запроса и ответа

### Слой Model (модели/данных) представлен классами 
- Api из api.ts предоставляет интерфейс взаимодействия с бэкендом/получения и отправки данных
- абстрактный класс Component, который задает интерфейс взаимодействия
с опеределенным типом данных, который в него пришел 
- класс Model, который задает определенный интерфейс модели данных с помощью дженериков.
- класс ItemsAPI, который наследует класс Api и имплементирует интерфейс IItemsAPI для получения 
и отправки списка товаров, одного товара

### Слой View (представление) представлен классами 

- класс Basket, который наследует класс Component с передачей интерфейса реализации IBasketView.
Класс позволяет производить основные операции с корзиной заказов:
    - set items - установка списка товаров
    - setText - отображение итоговой суммы товаров в синапсах
    - set total - установка итоговой цены всех товаров
    - get total - получение итоговой цены товаров

- класс Form, который наследует класс Component с передачей интерфейса реализации IFormState.
Класс позволяет производить основные операции с формами:
    - в конструкторе происходит нахождение кнопки и полей формы, а также установка
    слушателей событий ввода данных в поля формы и сабмита кнопки формы с передачей соответсвующих колбеков.
    - метод onInputChange оповещает приложение об изменении данных в полях ввода формы
    - set valid устанавливает валидность формы путем активации кнопки формы
    - set errors  отображение ошибок на форме при вводе значений в поля формы
    - render переопределяет родительский метод render у Component и рендерит форму с соответвующим состоянием 

- класс Modal, который наследует класс Component с передачей интерфейса реализации IModalData.
Класс позволяет производить основные операции с модальными окнами:
    - В конструкторе модального окна происходит поиск элементов модального окна (закрытие, контент, сабмит), а также установки слушателя на кнопку
    - метод set content позволяет отобразить в модальном окне желаемый контент, таким образом мы можем создать один экземпляр модального окна и постоянно менять в нем контент
    - методы open и close позволяют скрывать и показывать модальное окно через передачу сообщений с помошбю eventEmmiter
    - render переопределяет родительский метод render у Component и рендерит модальное окно с соответвующим контентом

- класс Success, который наследует класс Component с передачей интерфейса реализации ISuccess.
Класс позволяет сформировать показ итогового окна с успешно оплаченным заказом:
    - set total - сеттер который устанавливает итоговую цену оплаченного заказа
    - setText - приводит итоговое сообщение об успешно оплаченном заказе в соответвующий вид в синапсах

- класс Contacts, который наследует класс Form с передачей интерфейса реализации IContactForm.
Класс позволяет работать с формой контактов пользователя:
    - set phone - сеттер установки значения телефона
    - set email - сеттер установки значения почты

- класс Order, который наследует класс Form с передачей интерфейса реализации IOrderForm.
Класс позволяет работать с формой заказа товаров:
    - set address - сеттер установки адреса доставки
    - get payment - геттер вида платежа. Сам вид платежа устанавливается в конструкторе в зависимости от выбранного Таба

- класс Page, который наследует класс Component с передачей интерфейса реализации IPage.
Класс позволяет производить основные операции с главной страницей:
    - set counter - сеттер счетчика корзины
    - set gallery - сеттер для установки первоначального отображения списка доступных к покупке товаров
    - set locked - сеттер блокировки/разблокировки прокрутки страницы. Изменяется при открытии и закрытии модальных окон.

- класс Card, который наследует класс Component с передачей интерфейса реализации ICard.
Класс позволяет производить основные операции с карточками товаров. Некоторые поля сделаны опцинальными, так как в зависимости от состояния экрана, в карточке товара могут не отображаться некоторые параметры, например категория или описание:
    - группа сеттеров set category, set price, set title, set buttonText, set image, set description - сеттеры по установки соответвующих атрибутов карточки, значения которых приходят с сервера
    - get buttonText - геттер получения текста на кнопке
    - setIndexElement - метод для установки номера позиции карточки в корзине товаров.

- Класс CatalogItem, который наследуется от класса Card. Класс отвечается за отображения карточки на различных модальных окнах в приложении: начальный экран приложения, превью, корзина. За эту функциональность отвечает метод render().

- Класс AppState из файла AppData.ts наследует класс Model с передачей интерфейса IAppState.
Класс отвечает за глобальные состояния нашего приложения - состояния каталога товаров, списка заказов, списка товаров в корзине и ее отображение, карточки на превью и т.п.
    - метод setCatalog - устанавливает список карточек для отображения на начальном экране
    - метод setOrderList - установка списка товаров (LotItem[]) в изначальное пустое значение
    - метод setBasket - установка списка товаров (HTMLElement[]) как HTML - элементов в изначальное пустое значение
    - метод setPreview - установка в превью карточки по id, а также оповещение EventEmitter-ом о изменении события 
    - метод validateOrder - валидация полей ввода формы
    - setOrderField, setContactField - установка атрибутов экземпляра класса формы значениями из полей ввода формы.
    - getOrderList - геттер получения товаров для заказа

### Слой Presenter (управление/связывание данных и представления) представлен классами 
- класс EventEmitter, который имплементирует интерфейс IEvents и позволяет работать с событиями в нашем приложении.
    - метод on - позволяет подписаться на событие
    - метод off - позволяет отписаться от событиями
    - метод emit - позволяет сгенерировать событие
    - методы onAll и offAll позволяет подписаться и отписаться от всех событий
    
- файл index.ts в папке src - точка сборки приложения. Именно там происходит подключение всех модулей, поиск шаблонов разметки, создание экземпляров классов моделей и представление, запрос к бэкенду для получение данных и реализация логики событий EventEmitter