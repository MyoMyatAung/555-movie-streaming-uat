export interface IndexRecommendCarouselItem {
  image: string;
  type: string;
  title: string;
  sub_title: string;
  label: string;
  click: string;
}

export interface IndexRecommendListItem {
  id: string;
  name: string;
  cover: string;
  year: string;
  dynamic: number;
  label: string;
  type_name: string;
}

export interface AdvertItem {
  type: string;
  location_id: string;
  channel: string;
  remarks: string;
  data: {
    image: string;
    link: string;
  };
}

export interface NavigatorData {
  page: string;
  param?: Record<string, any>;
}

export interface RightAction {
  text: string;
  type: string;
  data: NavigatorData;
}

export interface IndexRecommendCarouselSection {
  layout: "index_recommend_carousel";
  title: string;
  list: IndexRecommendCarouselItem[];
  right: RightAction | {};
}

export interface IndexRecommendAdvertSection {
  layout: "advert_self";
  title: string;
  data: AdvertItem[];
  right: {};
  ads_per_row: number;
}

export interface IndexRecommendListSection {
  layout: "index_recommend_list";
  title: string;
  list: IndexRecommendListItem[];
  right: RightAction | {};
}

export type IndexRecommendSection =
  | IndexRecommendCarouselSection
  | IndexRecommendAdvertSection
  | IndexRecommendListSection;

export interface IndexRecommendResponse {
  status: boolean;
  message: string;
  data: IndexRecommendSection[];
}
