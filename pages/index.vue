<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <!-- Hero Section with Flowbite styling -->
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center p-2 mb-4 text-sm text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
          <i class="ri-plant-line mr-2"></i>
          <span class="font-medium">Plateforme #1 Agriculture Madagascar</span>
        </div>
        
        <h1 class="mb-4 text-5xl font-extrabold tracking-tight leading-none text-gray-900 md:text-6xl lg:text-7xl dark:text-white">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            🌱 Fataplus
          </span>
        </h1>
        
        <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
          La plateforme numérique qui révolutionne l'agriculture à Madagascar. 
          Connectez-vous avec des producteurs, apprenez de nouvelles techniques et 
          développez votre exploitation agricole.
        </p>
        
        <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <NuxtLink 
            to="/marketplace"
            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900 transition-all duration-300 transform hover:scale-105"
          >
            <i class="ri-store-2-line mr-2"></i>
            Explorer le Marché
            <i class="ri-arrow-right-line ml-2"></i>
          </NuxtLink>
          
          <NuxtLink 
            to="/learning"
            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all duration-300"
          >
            <i class="ri-graduation-cap-line mr-2"></i>
            Commencer à Apprendre
          </NuxtLink>
        </div>
      </div>

      <!-- Flowbite Product Cards Section -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Produits Populaires
          </h2>
          <p class="font-light text-gray-500 lg:mb-8 sm:text-xl dark:text-gray-400">
            Découvrez les meilleurs produits agricoles de Madagascar
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <FlowbiteCard
            title="Riz Rouge Premium"
            description="Riz rouge traditionnel cultivé dans les hautes terres de Madagascar. Riche en nutriments et au goût authentique."
            image="https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            category="Céréales"
            badge="Bio"
            price="2,500 Ar/kg"
            :rating="5"
            :tags="['Bio', 'Local', 'Premium']"
            location="Antsirabe"
            seller="Rabe Andry"
            primary-action-text="Acheter"
            secondary-action-text="Favoris"
            @primary-action="console.log('Riz acheté!')"
            @secondary-action="console.log('Ajouté aux favoris!')"
          />
          
          <FlowbiteCard
            title="Vanille Bourbon"
            description="Vanille bourbon de première qualité, séchée selon les méthodes traditionnelles malgaches."
            image="https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            category="Épices"
            badge="Export"
            price="15,000 Ar/gousse"
            :rating="5"
            :tags="['Export', 'Premium', 'Séché']"
            location="Sambava"
            seller="Hery Rakoto"
            primary-action-text="Commander"
            secondary-action-text="Contacter"
            @primary-action="console.log('Vanille commandée!')"
            @secondary-action="console.log('Vendeur contacté!')"
          />
          
          <FlowbiteCard
            title="Fruits de Baobab"
            description="Fruits de baobab riches en vitamine C, parfaits pour la préparation de jus et compléments naturels."
            image="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            category="Fruits"
            badge="Naturel"
            price="1,200 Ar/kg"
            :rating="4"
            :tags="['Vitamine C', 'Naturel', 'Local']"
            location="Morondava"
            seller="Soa Raharison"
            primary-action-text="Ajouter"
            secondary-action-text="Plus d'infos"
            @primary-action="console.log('Baobab ajouté!')"
            @secondary-action="console.log('Infos demandées!')"
          />
        </div>
      </div>

      <!-- Enhanced Features Section with Flowbite cards -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Pourquoi Choisir Fataplus?
          </h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full dark:bg-green-900">
              <i class="ri-store-2-line text-2xl text-green-600 dark:text-green-300"></i>
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Marché Digital</h3>
            <p class="text-gray-500 dark:text-gray-400">
              Vendez et achetez des produits agricoles directement avec les producteurs locaux dans un environnement sécurisé.
            </p>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full dark:bg-blue-900">
              <i class="ri-graduation-cap-line text-2xl text-blue-600 dark:text-blue-300"></i>
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Formation Expert</h3>
            <p class="text-gray-500 dark:text-gray-400">
              Apprenez les meilleures techniques agricoles adaptées au climat malgache avec nos experts agronomes.
            </p>
          </div>
          
          <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full dark:bg-purple-900">
              <i class="ri-team-line text-2xl text-purple-600 dark:text-purple-300"></i>
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Communauté Active</h3>
            <p class="text-gray-500 dark:text-gray-400">
              Échangez avec d'autres agriculteurs, partagez vos expériences et développez votre réseau professionnel.
            </p>
          </div>
        </div>
      </div>

      <!-- Enhanced Stats Section -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-8 dark:bg-gray-800 dark:border-gray-700">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Fataplus en Chiffres</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">L'impact de notre plateforme sur l'agriculture malgache</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="flex justify-center items-center w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full dark:bg-green-900">
              <i class="ri-user-line text-2xl text-green-600 dark:text-green-300"></i>
            </div>
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">1,000+</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Agriculteurs Actifs</div>
          </div>
          
          <div class="text-center">
            <div class="flex justify-center items-center w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full dark:bg-blue-900">
              <i class="ri-box-line text-2xl text-blue-600 dark:text-blue-300"></i>
            </div>
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Produits Disponibles</div>
          </div>
          
          <div class="text-center">
            <div class="flex justify-center items-center w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full dark:bg-purple-900">
              <i class="ri-book-line text-2xl text-purple-600 dark:text-purple-300"></i>
            </div>
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">50+</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Formations Expert</div>
          </div>
          
          <div class="text-center">
            <div class="flex justify-center items-center w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-full dark:bg-orange-900">
              <i class="ri-map-pin-line text-2xl text-orange-600 dark:text-orange-300"></i>
            </div>
            <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">20+</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Régions Couvertes</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple homepage - no complex dependencies
console.log('Homepage loaded successfully')
</script> 