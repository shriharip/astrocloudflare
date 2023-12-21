export interface IFeedExplore {
  id: number;
  title: string;
  url: string;
  upvotes: number;
  saves: number;
  category: {
    catg: string;
  };
  domain: {
    id: number;
    domain: string;
  };
  info: {
    content: string;
    onOfferContent: string;
    priceInfo: string;
  };
  author: {
    id: number;
    email: string;
    anonymous: boolean;
  };
}
