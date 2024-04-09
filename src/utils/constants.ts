const API_ORIGIN = "https://larek-api.nomoreparties.co"
export const API_URL = `${API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;

export const settingsTemplates = {
    successTemplate: '#success',
    cardCatalogTemplate: '#card-catalog',
    cardPreviewTemplate: '#card-preview',
    basketTemplate: '#basket',
    cardBasketTemplate: '#card-basket',
    orderTemplate: '#order',
    contactsTemplate: '#contacts'
};

export const settingsCategory = {
    'дополнительное': 'card__category_additional',
    'софт-скил': 'card__category_soft',
    'другое': 'card__category_other',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard' 
}
