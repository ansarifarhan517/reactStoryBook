type features = {
    iconName: string
    title: string
    description: string
}

type carouselItem = {
    id: string
    features: features[]
}

type featureTag = {
    title: string
    description: string
}

export type { features, carouselItem, featureTag }
