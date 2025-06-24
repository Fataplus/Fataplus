<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div class="absolute inset-0 bg-[url('/images/farm-pattern.svg')] opacity-10"></div>
      <div class="container mx-auto px-4 py-16 lg:py-24 relative">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                L'agriculture malgache
                <span class="text-green-600 dark:text-green-400">connectée</span>
              </h1>
              <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Rejoignez la première plateforme qui unit marché, formation et communauté 
                pour transformer l'agriculture à Madagascar.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <UButton 
                size="xl" 
                color="primary" 
                @click="navigateTo('/marketplace')"
                class="px-8 py-4"
              >
                <Icon name="heroicons:shopping-bag" class="w-6 h-6 mr-2" />
                Explorer le marché
              </UButton>
              <UButton 
                size="xl" 
                variant="outline" 
                @click="navigateTo('/learning')"
                class="px-8 py-4"
              >
                <Icon name="heroicons:academic-cap" class="w-6 h-6 mr-2" />
                Commencer à apprendre
              </UButton>
            </div>
            
            <!-- Stats rapides -->
            <div class="grid grid-cols-3 gap-8 pt-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">500+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Agriculteurs</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">1200+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Produits</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">50+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Formations</div>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <img 
              src="/images/hero-farmer.jpg" 
              alt="Agriculteur malgache" 
              class="rounded-2xl shadow-2xl w-full h-auto"
            />
            <div class="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">Certification Bio</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Produits certifiés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fonctionnalités principales -->
    <section class="py-16 lg:py-24 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trois piliers pour votre succès
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Fataplus combine marché digital, formation continue et communauté collaborative 
            pour révolutionner l'agriculture malgache.
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Marché -->
          <FeatureCard
            icon="heroicons:shopping-cart"
            title="Marché digital"
            description="Vendez vos produits directement aux consommateurs avec notre marketplace intuitif. Gestion des stocks, commandes et livraisons simplifiée."
            :features="[
              'Catalogue produits intelligent',
              'Gestion multi-boutiques',
              'Suivi des commandes',
              'Paiements sécurisés',
              'Analytics avancés'
            ]"
            action-text="Explorer le marché"
            action-link="/marketplace"
            color="green"
          />
          
          <!-- Formation -->
          <FeatureCard
            icon="heroicons:academic-cap"
            title="Formation & IA"
            description="Apprenez les meilleures pratiques agricoles avec nos cours interactifs et notre assistant IA personnalisé."
            :features="[
              'Cours vidéo interactifs',
              'Assistant IA personnel',
              'Certifications reconnues',
              'Communauté d\'entraide',
              'Suivi de progression'
            ]"
            action-text="Commencer à apprendre"
            action-link="/learning"
            color="blue"
          />
          
          <!-- Communauté -->
          <FeatureCard
            icon="heroicons:users"
            title="Communauté"
            description="Connectez-vous avec d'autres agriculteurs, partagez vos expériences et trouvez des mentors."
            :features="[
              'Forums de discussion',
              'Système de mentorat',
              'Événements communautaires',
              'Partage d\'expériences',
              'Défis et récompenses'
            ]"
            action-text="Rejoindre la communauté"
            action-link="/community"
            color="purple"
          />
        </div>
      </div>
    </section>

    <!-- Produits en vedette -->
    <section class="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Produits en vedette
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">
              Découvrez les meilleurs produits de nos agriculteurs
            </p>
          </div>
          <UButton 
            variant="outline" 
            @click="navigateTo('/marketplace')"
            class="hidden md:flex"
          >
            Voir tout
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </UButton>
        </div>
        
        <ProductGrid :products="featuredProducts" :limit="8" />
        
        <div class="text-center mt-12 md:hidden">
          <UButton 
            variant="outline" 
            @click="navigateTo('/marketplace')"
            size="lg"
          >
            Voir tous les produits
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </UButton>
        </div>
      </div>
    </section>

    <!-- Formations populaires -->
    <section class="py-16 lg:py-24 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Formations populaires
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">
              Développez vos compétences avec nos cours les plus suivis
            </p>
          </div>
          <UButton 
            variant="outline" 
            @click="navigateTo('/learning')"
            class="hidden md:flex"
          >
            Voir tout
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </UButton>
        </div>
        
        <CourseGrid :courses="popularCourses" :limit="6" />
        
        <div class="text-center mt-12 md:hidden">
          <UButton 
            variant="outline" 
            @click="navigateTo('/learning')"
            size="lg"
          >
            Voir toutes les formations
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </UButton>
        </div>
      </div>
    </section>

    <!-- Témoignages -->
    <section class="py-16 lg:py-24 bg-green-50 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ils nous font confiance
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            Découvrez les témoignages de notre communauté
          </p>
        </div>
        
        <TestimonialCarousel :testimonials="testimonials" />
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 lg:py-24 bg-green-600 dark:bg-green-700">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre agriculture ?
          </h2>
          <p class="text-xl text-green-100 mb-8">
            Rejoignez des centaines d'agriculteurs qui utilisent déjà Fataplus 
            pour développer leur activité et leurs compétences.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton 
              size="xl" 
              color="white" 
              @click="navigateTo('/auth/register')"
              class="px-8 py-4"
            >
              <Icon name="heroicons:user-plus" class="w-6 h-6 mr-2" />
              Créer un compte gratuit
            </UButton>
            <UButton 
              size="xl" 
              variant="outline" 
              color="white"
              @click="openAIAssistant"
              class="px-8 py-4"
            >
              <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6 mr-2" />
              Parler à notre IA
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Métadonnées de la page
useHead({
  title: 'Accueil',
  meta: [
    { name: 'description', content: 'Fataplus - La plateforme qui transforme l\'agriculture malgache. Marché, formation et communauté pour les agriculteurs de Madagascar.' },
    { property: 'og:title', content: 'Fataplus - Agriculture Madagascar' },
    { property: 'og:description', content: 'La plateforme qui transforme l\'agriculture malgache' }
  ]
})

// Stores
const { user } = useAuthStore()
const { toggleAIAssistant } = useUIStore()

// Données de la page
const { data: featuredProducts } = await useFetch('/api/products/featured')
const { data: popularCourses } = await useFetch('/api/courses/popular')

const testimonials = [
  {
    id: '1',
    name: 'Rakoto Jean',
    role: 'Agriculteur bio',
    location: 'Antsirabe',
    avatar: '/images/testimonials/rakoto.jpg',
    content: 'Grâce à Fataplus, j\'ai pu vendre mes légumes bio directement aux consommateurs. Mon chiffre d\'affaires a doublé en 6 mois !',
    rating: 5
  },
  {
    id: '2',
    name: 'Hery Andry',
    role: 'Éleveur',
    location: 'Fianarantsoa',
    avatar: '/images/testimonials/hery.jpg',
    content: 'Les formations sur l\'élevage m\'ont permis d\'améliorer la santé de mes animaux et d\'augmenter ma production de lait.',
    rating: 5
  },
  {
    id: '3',
    name: 'Naina Ranjato',
    role: 'Productrice de riz',
    location: 'Mahajanga',
    avatar: '/images/testimonials/naina.jpg',
    content: 'La communauté Fataplus m\'a aidée à résoudre mes problèmes de parasites. L\'entraide entre agriculteurs est formidable.',
    rating: 5
  }
]

// Méthodes
const openAIAssistant = () => {
  toggleAIAssistant()
}

// Analytics
onMounted(() => {
  // Track page view
  $fetch('/api/analytics/track', {
    method: 'POST',
    body: {
      event: 'page_view',
      page: 'home',
      userId: user.value?.id
    }
  })
})
</script> 