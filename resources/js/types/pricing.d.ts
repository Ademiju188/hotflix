interface PricingPlans {
    id: number,
    uuid: string,
    plan_type: PricingPlanTypes,
    name: string,
    description: string,
    price: number | string,
    hierarchy: number,
    active: boolean,
    created_at: string
}

interface PricingPlanTypes {
    id: number,
    name: string,
    description: string,
    duration: string,
}

interface PricingPlanPros extends PageProps {
    pricingPlans: {
        data: PricingPlans[]
    },
    planTypes: {
        data: PricingPlanTypes[]
    }
}
