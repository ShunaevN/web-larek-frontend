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
1. ***interface IItem***
    ```
    // получение товара с сервера
    interface IItem {
        id: string; // идентификатор товара
        description: string; // описание товара расширенное
        image: string; // картинка товара
        title: string; // название товара
        category: string; // категоря товара
        price: number; // стоимость товара
    } 
    ```
2. ***interface ISuccess***
     ```
    // модальное окно успешной покупки 
    interface ISuccess {
        total: number; // стоимость покупки
    }
    ```
3. ***interface IModalData***
    ```
    // отображение контента на модальном окне
    interface IModalData {
        content: HTMLElement; // встраивание и отображение контента в виде HTML-элемента
    }
    ```
4. ***interface IFormState***
    ```
    // состояние формы
    interface IFormState {
        valid: boolean; // валидация формы, корректность заполнения инпутов
        errors: string[]; // ошибки валидации
    }
    ```
5. ***interface IContactForm***
    ```
    // интерфейс формы с контактными данными пользователя
    interface IContactForm {
        email: string; // почта 
        phone: string; // телефон
    }
    ```
6. ***interface IOrderForm***
    ```
    // интерфейс формы с данными о заказе
    interface IOrderForm {
        payment: string; // тип платежа 
        address: string; // адрес доставки
    }
    ```
7. ***interface IOrder***
    ```
    // формирование интерфейса с полями итогового заказа для отправки на сервер
    interface IOrder extends IContactForm {
        payment: string; // тип платежа
        address: string; // адрес доставки
        items: string[]; // массив id-шников купленных товаров
        total: number; // итоговая стоимость покупки
    }
    // также из IContactForm приходят данные по почте и телефону
    ```
8. ***interface IOrderSuccess***
    ```
    // интерфейс позволяющий зафиксировать айди заказа и итоговую сумму
    interface IOrderSuccess extends IOrder {
        id: string; // идентификатор покупки пользователем
        total: number; // итоговая стоимость покупки
    }
    ```
9. ***interface BasketView***
    ```
    // интерфейс для отображения корзины с товарами и итоговой суммой
    interface IBasketView {
        items: HTMLElement[]; // купленные товары в виде массива HTML - элементов 
        total: number; // итоговая сумма товаров в корзине
    }
    ```
10. ***interface IAppState***
    ```
    // интерфейс для глобального состояния нашего приложения
    interface IAppState {
        gallery: IItem[]; // отображение товаров на стартовом экране
        basket: string[]; // наличие товаров в корзине
        preview: string | null; // наличие карточки товара в режиме прдпросмотра
        order: IOrder | null; // наличие успешного оформленного заказа
    }
    ```
11. ***interface ICardActions*** 
    ```
    // интерфейс для описания событий с карточками при клике
    interface ICardActions {
        onClick: (event: MouseEvent) => void; // событие onlick и описание callback-функции
    }
    ```
12. ***interface ICard***
    ```
    // интерфейс отображения карточки. Некоторые поля выделены опциональными, так как состояния показа карточки разнятся на разных модальных окнах
    interface ICard {
        title: string; // название товара
        description?: string | string[]; // описание 
        image: string; // картинка
        category: string; // категория
        price?: string; // стоимость товара
        index?: number; // индекс для отображения в корзине
    }
    ```
13. ***interface IPage*** 
    ```
    // отображения главной страницы приложения
    interface IPage {
        counter: number; // счетчик количества товаров в корзине
        gallery: HTMLElement[]; // список товаров доступных в магазине
        locked: boolean; // блокировка пролистывания основного экрана
    }
    ```
14. ***interface IItemsAPI***
    ```
    // интерфейс для описания взаимодействия с бэкендом и типизации запроса и ответа
    interface IItemsAPI {
        getItemList: () => Promise<IItem[]>; // запрос на получение списка всех товаров
        getItem: (id: string) => Promise<IItem>; // запрос на получение одного товара по id
        orderItems: (order: IOrder) => Promise<IOrderSuccess>; // запрос на добавление данных об успешной покупке
    }
    ```

## Слой Model (модели/данных) представлен классами 

1. ***класс Model<T>*** задает определенный интерфейс модели данных с помощью дженериков.
    // конструктор класса принимает данные типа указаного в дженерике и события имплеиентирующие интерфейс IEvents
    ```
    constructor(data: Partial<T>, protected events: IEvents) {}
    ```
    Класс представляет собой низкоуровневую обертку для работы с данными. Класс используется в основе работы 
    класса AppState по управлению глобальным состояние приложения.
    
2. ***Класс AppState из файла AppData.ts: class AppState extends Model\<IAppState\>*** наследует класс Model с передачей интерфейса IAppState. Класс отвечает за глобальные состояния нашего приложения - состояния каталога товаров, списка заказов, списка товаров в корзине и ее отображение, карточки на превью и т.п.
    ```
    // В конструктор класса вынесена первоначальная инициализация массивов с заказами и товарами в корзине
    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
        this.setBasket();
        this.setOrderList();
    }

    // метод setCatalog - устанавливает список карточек для отображения на начальном экране
    setCatalog(items: IItem[]) {}

    // метод setOrderList - установка списка товаров (LotItem[]) в изначальное пустое значение
    setOrderList() {}

    // метод setBasket - установка списка товаров (HTMLElement[]) как HTML - элементов в изначальное пустое значение
    setBasket() {}

    // метод setPreview - установка в превью карточки по id, а также оповещение EventEmitter-ом о изменении события 
    setPreview(item: LotItem) {}

    // метод validateOrder - валидация полей ввода формы
    validateOrder() {}

    // setOrderField, setContactField - установка атрибутов экземпляра класса формы значениями из полей ввода формы.
    setOrderField(field: keyof IContactForm, value: string) {}
    setContactField(field: keyof IOrderForm, value: string) {}

    // getOrderList - геттер получения товаров для заказа
    getOrderList() {}
    ```

## Слой View (представление) представлен классами

1. ***абстрактный класс Component<T>*** задает интерфейс взаимодействия
с опеределенным типом данных, который в него пришел в виде дженерика.
    // конструктор класса принимает контейнер в виде HTML-элемента
    ```
    protected constructor(protected readonly container: HTMLElement) {}
    ```
    Класс представляет собой низкоуровневую обертку по взаимодействию с HTML-элементами и
    поддерживает следующие операции
    ```
    // Переключение класса на элементе. Параметры: элемент, название класса, true - добавить класс, false - удалить
    toggleClass(element: HTMLElement, className: string, force?: boolean) {}

    // установка текста на элемент
    setText(element: HTMLElement, value: unknown) {}

    // Сделать элемент доступным/недоступным для взаимодействия
    setDisabled(element: HTMLElement, state: boolean) {}

    // скрыть элемент
    setHidden(element: HTMLElement) {}

    // показать элемент
    setVisible(element: HTMLElement) {}

    // установить изображение на элемент. Параметры: HTML-элемент картинка, ссылка на картинку, опционально - описание 
    setImage(element: HTMLImageElement, src: string, alt?: string) {}

    // отрисовка элемента с установкой опциональных данных 
    render(data?: Partial<T>): HTMLElement {}
    ```

2. ***класс Basket: class Basket extends Component \<IBasketView\>*** наследует класс Component с передачей интерфейса реализации IBasketView. Класс позволяет производить основные операции с корзиной заказов:
    ``` 
    // конструктор класса принимает HTML-элемент - контейнер и собития типа EventEmitter
    constructor(container: HTMLElement, protected events: EventEmitter) {}

    // set items - установка списка товаров
    set items(items: HTMLElement[]) {}

    // setText - отображение итоговой суммы товаров в синапсах
    setText(element: HTMLElement, value: unknown) {}

    // set total - установка итоговой цены всех товаров
    set total(total: number) {}

    // get total - получение итоговой цены товаров
    get total() {}

    // get button - получение разметки кнопки для дальнейшей блокировки\разблокировки
    get button(){}
    ```
3. ***класс Form: class Form\<T\> extends Component\<IFormState\>*** наследует класс Component с передачей интерфейса реализации IFormState. Класс позволяет производить основные операции с формами:
    ```
    // конструктор класса принимает HTML-элемент - контейнер и собития типа EventEmitter
    constructor(protected container: HTMLFormElement, protected events: IEvents) {}

    // метод onInputChange оповещает приложение об изменении данных в полях ввода формы
    onInputChange(field: keyof T, value: string) {}

    // set valid устанавливает валидность формы путем активации кнопки формы
    valid(value: boolean) {}

    // set errors  отображение ошибок на форме при вводе значений в поля формы
    set errors(value: string) {}

    // render переопределяет родительский метод render у Component и рендерит форму с соответвующим состоянием 
    render(state: Partial<T> & IFormState) {}
    ```

4. ***класс Modal: class Modal extends Component\<IModalData\>*** наследует класс Component с передачей интерфейса реализации IModalData. Класс позволяет производить основные операции с модальными окнами:
    ```
    // В конструкторе модального окна происходит поиск элементов модального окна (закрытие, контент, сабмит), а также установки слушателя на кнопку
    constructor(container: HTMLElement, protected events: IEvents) {}

    // метод set content позволяет отобразить в модальном окне желаемый контент, таким образом мы можем создать один экземпляр модального окна и постоянно менять в нем контент
    set content(value: HTMLElement) {}

    // методы open и close позволяют скрывать и показывать модальное окно через передачу сообщений с помошбю eventEmmiter
    open() {}
    close() {}

    // render переопределяет родительский метод render у Component и рендерит модальное окно с соответвующим контентом
    render(data: IModalData): HTMLElement {}
    ```

5. ***класс Success: class Success extends Component\<ISuccess\>*** наследует класс Component с передачей интерфейса реализации ISuccess. Класс позволяет сформировать показ итогового окна с успешно оплаченным заказом:
    ```
    // конструктор класса принимает HTML-элемент - контейнер и собития типа EventEmitter
    constructor(protected container: HTMLFormElement, protected events: IEvents) {}

    // set total - сеттер который устанавливает итоговую цену оплаченного заказа
    set total(value: number){}

    // setText - приводит итоговое сообщение об успешно оплаченном заказе в соответвующий вид в синапсах
    setText(element: HTMLElement, value: unknown) {}
    ```

6. ***класс Contacts: class ContactForm extends Form\<IContactForm\>*** наследует класс Form с передачей интерфейса реализации IContactForm. Класс позволяет работать с формой контактов пользователя:
    ```
    // конструктор класса принимает HTML-элемент - контейнер и собития типа EventEmitter
    constructor(protected container: HTMLFormElement, protected events: IEvents) {}

    // set phone - сеттер установки значения телефона
    set phone(value: string) {}

    // set email - сеттер установки значения почты
    set email(value: string) {}
    ```

7. ***класс Order: class Order extends Form\<IOrderForm\>*** наследует класс Form с передачей интерфейса реализации IOrderForm. Класс позволяет работать с формой заказа товаров:
    ```
    // конструктор класса принимает HTML-элемент - контейнер и собития типа EventEmitter
    constructor(protected container: HTMLFormElement, protected events: IEvents) {}

    // set address - сеттер установки адреса доставки
    set address(value: string) {}

    // get payment - геттер вида платежа. Сам вид платежа устанавливается в конструкторе в зависимости от выбранного Таба
    get payment() {}
    ```

8. ***класс Page: class Page extends Component\<IPage\>*** наследует класс Component с передачей интерфейса реализации IPage. Класс позволяет производить основные операции с главной страницей:
    ```
    // конструктор класса принимает HTML-элемент - контейнер и собития типа EventEmitter
    constructor(protected container: HTMLFormElement, protected events: IEvents) {}

    // set counter - сеттер счетчика корзины
    set counter(value: number) {}

    // set gallery - сеттер для установки первоначального отображения списка доступных к покупке товаров
    set gallery(items: HTMLElement[]) {}

    // set locked - сеттер блокировки/разблокировки прокрутки страницы. Изменяется при открытии и закрытии модальных окон.
    set locked(value: boolean) {}
    ```

9. ***класс Card: class Card extends Component\<ICard\>*** наследует класс Component с передачей интерфейса реализации ICard. Класс позволяет производить основные операции с карточками товаров. Некоторые поля сделаны опцинальными, так как в зависимости от состояния экрана, в карточке товара могут не отображаться некоторые параметры, например категория или описание:
    ```
    // консруктор производит поиск элементов через утилиту ensureElement, поэтому в коструктор помимо контейнера
    мы передаем и blockName для поиска элементов именованным по БЭМ
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {}

    // группа сеттеров set category, set price, set title, set buttonText, set image, set description - сеттеры по установки соответвующих атрибутов карточки, значения которых приходят с сервера
    set category(value: string) {}  
    set price(value: string) {}
    set title(value: string) {}
    set buttonText(value: string) {}
    set image(value: string) {}
    set description(value: string | string[]) {}

    // get buttonText  и get button() - геттеры получения текста на кнопке и самого элемента кнопки
    get buttonText() {}
    get button() {}

    // setIndexElement - метод для установки номера позиции карточки в корзине товаров.
    setIndexElement() {}
    ```

10. ***Класс CatalogItem: class CatalogItem extends Card*** наследуется от класса Card. Класс отвечается за отображения карточки на различных модальных окнах в приложении: начальный экран приложения, превью, корзина. За эту функциональность отвечает метод render().
    ```
    // конструктор класса принимает HTML-элемент - контейнер, собития типа EventEmitter и опциональный набор действий с карточкой типа ICardActions
    constructor(container: HTMLElement, protected events: EventEmitter, actions?: ICardActions) {}

    // render переопределяет родительский метод render у Component и рендерит карточку с соответвующим набором атрибутов по шаблону 
    render(data?: Partial<ICard>): HTMLElement {}
    ```


## Слой Presenter (управление/связывание данных и представления) представлен классами 
1. ***класс EventEmitter*** имплементирует интерфейс IEvents и позволяет работать с событиями в нашем приложении.
    ```
    // В конструкторе происходит инициализация событий в виде Map с указанием названия события и подписчиков
     constructor() { this._events = new Map<EventName, Set<Subscriber>>() }
    ```
    _метод on_ - позволяет подписаться на событие
    ```
    // Принимает в параметрах имя события и коллбэк функция в виде дженерика, который является наследником object
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {}
    ```
    _метод off_ - позволяет отписаться от событиями
    ```
    // Принимает в параметрах имя события и коллбэк функция - экземпляра Subscriber
    off(eventName: EventName, callback: Subscriber) {}
    ```
    _метод emit_ - позволяет сгенерировать событие
    ```
    // Принимает в параметрах имя события и опциональные данные параметризированного типа
    emit<T extends object>(eventName: string, data?: T) {}
    ```
    _методы onAll и offAll_ позволяет подписаться и отписаться от всех событий
    ```
    // В параметрах передается коллбэк функция типа EmitterEvent
    onAll(callback: (event: EmitterEvent) => void) {}

    // Вызов пез параметров
    offAll() {}
    ```
    _метод trigger_ генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы.
    
    
2. ***файл index.ts в папке src  точка сборки приложения***. Именно там происходит подключение всех модулей, поиск шаблонов разметки, создание экземпляров классов моделей и представление, запрос к бэкенду для получение данных и реализация логики событий EventEmitter

## ***Связь с сервером*** осуществляется с помошью класса ItemsAPI

- ***класс ItemsAPI*** наследует класс Api и имплементирует интерфейс IItemsAPI для получения 
и отправки списка товаров, одного товара
    // конструктор класса принимает ссылку для получения контента сайта, ссылку для взаимодействия с REST-Api
    // и опциональные параметры для установке в заголовке запроса
    ```
    constructor(cdn: string, baseUrl: string, options?: RequestInit){}
    
    Класс предоставляет следующие методы:
    // получение товара по идентификатору. Возвращает товар, соответсвующий интерфейсу IItem
    getItem(id: string): Promise<IItem> {}

    // получение списка товаров. Возвращает товары, соответсвующий интерфейсу IItem
    getItemList(): Promise<IItem[]>{}

    // добавление заказа, данные которого соответвуют интерфейсу IOrder. Возвращается ответ соответвующий IOrderSuccess
    orderItems(order: IOrder): Promise<IOrderSuccess> {}
    ```