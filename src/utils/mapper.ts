import { Project, Builder } from '../types';

// --- Projects ---

// --- Projects ---

export const mapProjectToDb = (project: Partial<Project>) => {
    const {
        builderId, priceRange, possessionDate, heroImage, reraId,
        exactPrice, priceType, seoKeywords, metaDescription, configurationDetails,
        masterLayout, floorPlans, verificationStatus, pricePerSqft, verificationSource,
        highlights,
        ...rest
    } = project;

    return {
        ...rest,
        builder_id: builderId,
        price_range: priceRange,
        possession_date: possessionDate,
        hero_image: heroImage,
        rera_id: reraId,
        exact_price: exactPrice,
        price_type: priceType,
        seo_keywords: seoKeywords,
        meta_description: metaDescription,
        configuration_details: configurationDetails,
        master_layout: masterLayout,
        floor_plans: floorPlans,
        verification_status: verificationStatus,
        price_per_sqft: pricePerSqft,
        verification_source: verificationSource,
        highlights: highlights
    };
};

export const mapProjectFromDb = (data: any): Project => {
    return {
        ...data,
        builderId: data.builder_id || data.builderId,
        priceRange: data.price_range || data.priceRange,
        possessionDate: data.possession_date || data.possessionDate,
        heroImage: data.hero_image || data.heroImage,
        reraId: data.rera_id || data.reraId,
        exactPrice: data.exact_price || data.exactPrice,
        priceType: data.price_type || data.priceType,
        seoKeywords: data.seo_keywords || data.seoKeywords,
        metaDescription: data.meta_description || data.metaDescription,
        configurationDetails: data.configuration_details || data.configurationDetails,
        masterLayout: data.master_layout || data.masterLayout,
        floorPlans: data.floor_plans || data.floorPlans,
        verificationStatus: data.verification_status || data.verificationStatus,
        pricePerSqft: data.price_per_sqft || data.pricePerSqft,
        verificationSource: data.verification_source || data.verificationSource,
        highlights: data.highlights || data.highlights
    };
};

// --- Builders ---

export const mapBuilderToDb = (builder: Partial<Builder>) => {
    const {
        heroImage, establishedYear, totalProjects, ongoingProjects,
        trustScore, isVerified, logo, // Explicit destructure
        ...rest
    } = builder;

    return {
        ...rest,
        logo: logo, // Explicit mapping
        hero_image: heroImage,
        established_year: establishedYear,
        total_projects: totalProjects,
        ongoing_projects: ongoingProjects,
        trust_score: trustScore,
        is_verified: isVerified
    };
};

export const mapBuilderFromDb = (data: any): Builder => {
    return {
        ...data,
        id: data.id, // Explicit
        logo: data.logo, // Explicit (Ensure it's not lost)
        heroImage: data.hero_image || data.heroImage,
        establishedYear: data.established_year || data.establishedYear,
        totalProjects: data.total_projects || data.totalProjects,
        ongoingProjects: data.ongoing_projects || data.ongoingProjects,
        trustScore: data.trust_score || data.trustScore,
        isVerified: data.is_verified || data.isVerified
    };
};
