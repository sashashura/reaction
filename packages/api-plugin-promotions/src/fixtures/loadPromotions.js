const now = new Date();


const OrderPromotion = {
  _id: "orderPromotion",
  label: "5 percent off your entire order when you spend more then $200",
  description: "5 percent off your entire order when you spend more then $200",
  enabled: true,
  triggers: [{ triggerKey: "offers" }],
  offerRule: {
    name: "5 percent off your entire order when you spend more then $200",
    conditions: {
      any: [{
        fact: "cart",
        path: "$.merchandiseTotal",
        operator: "greaterThanInclusive",
        value: 200
      }]
    },
    event: { // define the event to fire when the conditions evaluate truthy
      type: "triggerAction",
      params: {
        promotionId: "orderPromotion"
      }
    }
  },
  actions: [{
    actionKey: "noop",
    actionParameters: {}
  }],
  startDate: now,
  stackAbility: "none",
  reportAsTaxable: true
};


const promotions = [OrderPromotion];

/**
 * @summary Load promotions fixtures
 * @param {Object} context - The application context
 * @returns {Promise<void>} undefined
 */
export default async function loadPromotions(context) {
  const { simpleSchemas: { Promotion: PromotionSchema }, collections: { Promotions, Shops } } = context;
  const defaultShop = await Shops.findOne({ shopType: "primary" }, { _id: 1 });
  if (defaultShop) {
    for (const promotion of promotions) {
      promotion.shopId = defaultShop._id;
      PromotionSchema.validate(promotion);
      // eslint-disable-next-line no-await-in-loop
      await Promotions.updateOne({ _id: promotion._id }, { $set: promotion }, { upsert: true });
    }
  }
}
