// Demo store placeholders
const PLACEHOLDERS = {
  PRODUCT_INFO: [
    {
      title: 'Description',
      content:
        'We threw snow tires on our core classics... Good for all year round! Named after my favorite football match of the year. Just like any of our joints, dress them up or down...',
    },
    {
      title: 'Size and Fit',
      content:
        'We threw snow tires on our core classics... Good for all year round! Named after my favorite football match of the year. Just like any of our joints, dress them up or down...',
    },
    {
      title: 'Delivery and Returns',
      content: `The towels had been hanging from the rod for years. They were stained and worn, and quite frankly, just plain ugly. Debra didn't want to touch them but she really didn't have a choice. It was important for her to see what was living within them. Patrick didn't want to go. The fact that she was insisting they must go made him want to go even less. He had no desire to make small talk with strangers he would never again see just to be polite. But she insisted that Patrick go, and she would soon find out that this would be the biggest mistake she could make in their relationship.`,
    },
  ],
  PRODUCT: {
    label: 'Limited Edition',
    id: 'gid://shopify/Product/6730850828344',
    title: 'Eden Glance',
    publishedAt: '2023-06-17T18:33:17Z',
    handle: 'eden-glance',
    description:
      "Introducing a mesmerizing ensemble that captures the essence of untamed elegance – the Eden Glance. This enchanting dress is a celebration of nature's most captivating patterns, skillfully mimicking the intricate beauty of snake skin. The gown boasts a sleek, form-fitting silhouette that accentuates every curve, exuding a sense of serpentine grace. Crafted from luxurious, iridescent fabric, the dress shimmers with an ever-changing play of colors reminiscent of a snake's mesmerizing scales. The intricate detailing perfectly replicates the organic patterns found in nature, creating a visually stunning and tactile experience. The dress features a daring neckline that adds a touch of allure, while the fluidity of the fabric allows for graceful movement, echoing the sinuous motion of a slithering serpent. The Eden Glance is more than just a garment; it is a symbol of strength, mystery, and sensuality. Whether worn at a glamorous soirée or an upscale event, this dress is bound to captivate onlookers and make a bold, unforgettable statement. Embrace the wild beauty of the Eden Glance and step into a world where fashion meets the untamed allure of the natural world.",
    priceRange: {
      minVariantPrice: {
        amount: '775.0',
        currencyCode: 'RON',
      },
      maxVariantPrice: {
        amount: '775.0',
        currencyCode: 'RON',
      },
    },
    options: [
      {
        name: 'Color',
        values: ["Snake's Scales", 'Serpentine Grace', 'Untamed Elegance'],
      },
      {
        name: 'Size',
        values: ['154', '158', '160'],
      },
    ],
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/41007289630776',
          image: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/hydrogen-morning.jpg?v=1636146509',
            altText: 'Eden Glance',
            width: 1200,
            height: 1504,
          },
          price: {
            amount: '775.0',
            currencyCode: 'RON',
          },
          compareAtPrice: {
            amount: '840.0',
            currencyCode: 'RON',
          },
        },
      ],
    },
  },
};

// get product info placeholder data
export function getProductInfoPlaceholder() {
  function getMultipleRandom(arr, infos) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, infos);
  }
  return getMultipleRandom(PLACEHOLDERS.PRODUCT_INFO, 3);
}

export function getProductPlaceholder() {
  return PLACEHOLDERS.PRODUCT;
}
