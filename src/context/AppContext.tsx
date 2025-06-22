import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Flashcard, Category, SortOption, ViewMode, ThemeConfig, LanguageLevel, StudyModeOption } from '../types';

const masterFlashcards: Omit<Flashcard, 'studyProgress' | 'created_at'>[] = [
  { "id": "card-1", "englishWord": "Book", "spanishTranslation": "Libro", "frenchTranslation": "Livre", "englishSentence": "I read a book every day.", "spanishSentence": "Leo un libro todos los días.", "frenchSentence": "Je lis un livre chaque jour.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/book.jpg" },
  { "id": "card-2", "englishWord": "House", "spanishTranslation": "Casa", "frenchTranslation": "Maison", "englishSentence": "I live in a big house.", "spanishSentence": "Vivo en una casa grande.", "frenchSentence": "Je vis dans une grande maison.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/house.jpg" },
  { "id": "card-3", "englishWord": "Dog", "spanishTranslation": "Perro", "frenchTranslation": "Chien", "englishSentence": "My dog is very friendly.", "spanishSentence": "Mi perro es muy amigable.", "frenchSentence": "Mon chien est très amical.", "categoryIds": ["animals"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/dog.jpg" },
  { "id": "card-4", "englishWord": "Cat", "spanishTranslation": "Gato", "frenchTranslation": "Chat", "englishSentence": "I have a black cat.", "spanishSentence": "Tengo un gato negro.", "frenchSentence": "J'ai un chat noir.", "categoryIds": ["animals"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/cat.jpg" },
  { "id": "card-5", "englishWord": "Table", "spanishTranslation": "Mesa", "frenchTranslation": "Table", "englishSentence": "There is a table in the room.", "spanishSentence": "Hay una mesa en la habitación.", "frenchSentence": "Il y a une table dans la chambre.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/table.jpg" },
  { "id": "card-6", "englishWord": "Pen", "spanishTranslation": "Bolígrafo", "frenchTranslation": "Stylo", "englishSentence": "I use a pen to write.", "spanishSentence": "Uso un bolígrafo para escribir.", "frenchSentence": "J'utilise un stylo pour écrire.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/pen.jpg" },
  { "id": "card-7", "englishWord": "Apple", "spanishTranslation": "Manzana", "frenchTranslation": "Pomme", "englishSentence": "I like eating apples.", "spanishSentence": "Me gusta comer manzanas.", "frenchSentence": "J'aime manger des pommes.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/apple.jpg" },
  { "id": "card-8", "englishWord": "Car", "spanishTranslation": "Coche", "frenchTranslation": "Voiture", "englishSentence": "I drive a red car.", "spanishSentence": "Conduzco un coche rojo.", "frenchSentence": "Je conduis une voiture rouge.", "categoryIds": ["transport"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/car.jpg" },
  { "id": "card-9", "englishWord": "Window", "spanishTranslation": "Ventana", "frenchTranslation": "Fenêtre", "englishSentence": "The window is open.", "spanishSentence": "La ventana está abierta.", "frenchSentence": "La fenêtre est ouverte.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/window.jpg" },
  { "id": "card-10", "englishWord": "Friend", "spanishTranslation": "Amigo", "frenchTranslation": "Ami", "englishSentence": "My friend is coming tomorrow.", "spanishSentence": "Mi amigo viene mañana.", "frenchSentence": "Mon ami vient demain.", "categoryIds": ["people"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/friend.jpg" },
  { "id": "card-11", "englishWord": "Chair", "spanishTranslation": "Silla", "frenchTranslation": "Chaise", "englishSentence": "I sit on the chair.", "spanishSentence": "Me siento en la silla.", "frenchSentence": "Je m'assois sur la chaise.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/chair.jpg" },
  { "id": "card-12", "englishWord": "Bird", "spanishTranslation": "Pájaro", "frenchTranslation": "Oiseau", "englishSentence": "The bird is flying.", "spanishSentence": "El pájaro está volando.", "frenchSentence": "L'oiseau vole.", "categoryIds": ["animals"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bird.jpg" },
  { "id": "card-13", "englishWord": "School", "spanishTranslation": "Escuela", "frenchTranslation": "École", "englishSentence": "I go to school every day.", "spanishSentence": "Voy a la escuela todos los días.", "frenchSentence": "Je vais à l'école tous les jours.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/school.jpg" },
  { "id": "card-14", "englishWord": "Sun", "spanishTranslation": "Sol", "frenchTranslation": "Soleil", "englishSentence": "The sun is shining.", "spanishSentence": "El sol está brillando.", "frenchSentence": "Le soleil brille.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/sun.jpg" },
  { "id": "card-15", "englishWord": "Water", "spanishTranslation": "Agua", "frenchTranslation": "Eau", "englishSentence": "I drink water every morning.", "spanishSentence": "Bebo agua todas las mañanas.", "frenchSentence": "Je bois de l'eau chaque matin.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/water.jpg" },  
  { "id": "card-16", "englishWord": "Shirt", "spanishTranslation": "Camisa", "frenchTranslation": "Chemise", "englishSentence": "I wear a blue shirt.", "spanishSentence": "Llevo una camisa azul.", "frenchSentence": "Je porte une chemise bleue.", "categoryIds": ["clothing"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/shirt.jpg" },
  { "id": "card-17", "englishWord": "Food", "spanishTranslation": "Comida", "frenchTranslation": "Nourriture", "englishSentence": "I like food.", "spanishSentence": "Me gusta la comida.", "frenchSentence": "J'aime la nourriture.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/food.jpg" },
  { "id": "card-18", "englishWord": "Phone", "spanishTranslation": "Teléfono", "frenchTranslation": "Téléphone", "englishSentence": "I call my friend on the phone.", "spanishSentence": "Llamo a mi amigo por teléfono.", "frenchSentence": "J'appelle mon ami au téléphone.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/phone.jpg" },
  { "id": "card-19", "englishWord": "Bag", "spanishTranslation": "Bolsa", "frenchTranslation": "Sac", "englishSentence": "I have a red bag.", "spanishSentence": "Tengo una bolsa roja.", "frenchSentence": "J'ai un sac rouge.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bag.jpg" },
  { "id": "card-20", "englishWord": "Ball", "spanishTranslation": "Pelota", "frenchTranslation": "Balle", "englishSentence": "I play with a ball.", "spanishSentence": "Juego con una pelota.", "frenchSentence": "Je joue avec une balle.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/ball.jpg" },
  { "id": "card-21", "englishWord": "Bed", "spanishTranslation": "Cama", "frenchTranslation": "Lit", "englishSentence": "I sleep in my bed.", "spanishSentence": "Duermo en mi cama.", "frenchSentence": "Je dors dans mon lit.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bed.jpg" },
  { "id": "card-22", "englishWord": "Tree", "spanishTranslation": "Árbol", "frenchTranslation": "Arbre", "englishSentence": "That tree provides a lot of shade.", "spanishSentence": "Ese árbol da mucha sombra.", "frenchSentence": "Cet arbre donne beaucoup d'ombre.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/tree.jpg" },
  { "id": "card-23", "englishWord": "Street", "spanishTranslation": "Calle", "frenchTranslation": "Rue", "englishSentence": "The street is busy.", "spanishSentence": "La calle está ocupada.", "frenchSentence": "La rue est animée.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/street.jpg" },
  { "id": "card-24", "englishWord": "Watch", "spanishTranslation": "Reloj", "frenchTranslation": "Montre", "englishSentence": "I wear a watch on my wrist.", "spanishSentence": "Llevo un reloj en mi muñeca.", "frenchSentence": "Je porte une montre à mon poignet.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/watch.jpg" },
  { "id": "card-25", "englishWord": "Coffee", "spanishTranslation": "Café", "frenchTranslation": "Café", "englishSentence": "I drink coffee in the morning.", "spanishSentence": "Bebo café por la mañana.", "frenchSentence": "Je bois du café le matin.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/coffee.jpg" },
  { "id": "card-26", "englishWord": "Ice cream", "spanishTranslation": "Helado", "frenchTranslation": "Glace", "englishSentence": "I love eating ice cream.", "spanishSentence": "Me encanta comer helado.", "frenchSentence": "J'adore manger de la glace.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/ice-cream.jpg" },
  { "id": "card-27", "englishWord": "Lamp", "spanishTranslation": "Lámpara", "frenchTranslation": "Lampe", "englishSentence": "The lamp is on the table.", "spanishSentence": "La lámpara está sobre la mesa.", "frenchSentence": "La lampe est sur la table.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/lamp.jpg" },
  { "id": "card-28", "englishWord": "Shoes", "spanishTranslation": "Zapatos", "frenchTranslation": "Chaussures", "englishSentence": "I buy new shoes.", "spanishSentence": "Compro zapatos nuevos.", "frenchSentence": "J'achète des nouvelles chaussures.", "categoryIds": ["clothing"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/shoes.jpg" },
  { "id": "card-29", "englishWord": "Cup", "spanishTranslation": "Taza", "frenchTranslation": "Tasse", "englishSentence": "I drink tea from a cup.", "spanishSentence": "Bebo té de una taza.", "frenchSentence": "Je bois du thé dans une tasse.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/cup.jpg" },
  { "id": "card-30", "englishWord": "Computer", "spanishTranslation": "Computadora", "frenchTranslation": "Ordinateur", "englishSentence": "I use the computer every day.", "spanishSentence": "Uso la computadora todos los días.", "frenchSentence": "J'utilise l'ordinateur tous les jours.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/computer.jpg" },  
  { "id": "card-31", "englishWord": "Flower", "spanishTranslation": "Flor", "frenchTranslation": "Fleur", "englishSentence": "She gave me a beautiful flower.", "spanishSentence": "Ella me dio una hermosa flor.", "frenchSentence": "Elle m'a donné une belle fleur.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/flower.jpg" },
  { "id": "card-32", "englishWord": "Rain", "spanishTranslation": "Lluvia", "frenchTranslation": "Pluie", "englishSentence": "It is raining outside.", "spanishSentence": "Está lloviendo afuera.", "frenchSentence": "Il pleut dehors.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/rain.jpg" },
  { "id": "card-33", "englishWord": "Egg", "spanishTranslation": "Huevo", "frenchTranslation": "Œuf", "englishSentence": "I eat eggs for breakfast.", "spanishSentence": "Como huevos para el desayuno.", "frenchSentence": "Je mange des œufs au petit déjeuner.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/egg.jpg" },
  { "id": "card-34", "englishWord": "Hat", "spanishTranslation": "Sombrero", "frenchTranslation": "Chapeau", "englishSentence": "I wear a hat in the sun.", "spanishSentence": "Llevo un sombrero en el sol.", "frenchSentence": "Je porte un chapeau sous le soleil.", "categoryIds": ["clothing"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/hat.jpg" },
  { "id": "card-35", "englishWord": "Clock", "spanishTranslation": "Reloj", "frenchTranslation": "Horloge", "englishSentence": "The clock is on the wall.", "spanishSentence": "El reloj está en la pared.", "frenchSentence": "L'horloge est sur le mur.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/clock.jpg" },
  { "id": "card-36", "englishWord": "T-shirt", "spanishTranslation": "Camiseta", "frenchTranslation": "T-shirt", "englishSentence": "I am wearing a blue T-shirt.", "spanishSentence": "Estoy usando una camiseta azul.", "frenchSentence": "Je porte un T-shirt bleu.", "categoryIds": ["clothing"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/tshirt.jpg" },
  { "id": "card-37", "englishWord": "Bicycle", "spanishTranslation": "Bicicleta", "frenchTranslation": "Vélo", "englishSentence": "She rides a bicycle every day.", "spanishSentence": "Ella monta una bicicleta todos los días.", "frenchSentence": "Elle fait du vélo tous les jours.", "categoryIds": ["transport"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bicycle.jpg" },
  { "id": "card-38", "englishWord": "Pizza", "spanishTranslation": "Pizza", "frenchTranslation": "Pizza", "englishSentence": "I like to eat pizza on weekends.", "spanishSentence": "Me gusta comer pizza los fines de semana.", "frenchSentence": "J'aime manger de la pizza le week-end.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/pizza.jpg" },
  { "id": "card-39", "englishWord": "Door", "spanishTranslation": "Puerta", "frenchTranslation": "Porte", "englishSentence": "Please close the door.", "spanishSentence": "Por favor, cierra la puerta.", "frenchSentence": "S'il vous plaît, fermez la porte.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/door.jpg" },
  { "id": "card-40", "englishWord": "Camera", "spanishTranslation": "Cámara", "frenchTranslation": "Appareil photo", "englishSentence": "I have a new camera.", "spanishSentence": "Tengo una cámara nueva.", "frenchSentence": "J'ai un nouvel appareil photo.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/camera.jpg" },
  { "id": "card-41", "englishWord": "Pencil", "spanishTranslation": "Lápiz", "frenchTranslation": "Crayon", "englishSentence": "I write with a pencil.", "spanishSentence": "Escribo con un lápiz.", "frenchSentence": "J'écris avec un crayon.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/pencil.jpg" },
  { "id": "card-42", "englishWord": "Key", "spanishTranslation": "Llave", "frenchTranslation": "Clé", "englishSentence": "I lost my key.", "spanishSentence": "Perdí mi llave.", "frenchSentence": "J'ai perdu ma clé.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/key.jpg" },
  { "id": "card-43", "englishWord": "Bread", "spanishTranslation": "Pan", "frenchTranslation": "Pain", "englishSentence": "I eat bread with butter.", "spanishSentence": "Como pan con mantequilla.", "frenchSentence": "Je mange du pain avec du beurre.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bread.jpg" },
  { "id": "card-44", "englishWord": "Notebook", "spanishTranslation": "Cuaderno", "frenchTranslation": "Carnet", "englishSentence": "I write in my notebook every day.", "spanishSentence": "Escribo en mi cuaderno todos los días.", "frenchSentence": "J'écris dans mon carnet tous les jours.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/notebook.jpg" },
  { "id": "card-45", "englishWord": "Bus", "spanishTranslation": "Autobús", "frenchTranslation": "Autobus", "englishSentence": "I go to school by bus.", "spanishSentence": "Voy a la escuela en autobús.", "frenchSentence": "Je vais à l'école en bus.", "categoryIds": ["transport"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bus.jpg" },
  { "id": "card-46", "englishWord": "Hotel", "spanishTranslation": "Hotel", "frenchTranslation": "Hôtel", "englishSentence": "We stayed in a nice hotel.", "spanishSentence": "Nos alojamos en un hotel bonito.", "frenchSentence": "Nous sommes restés dans un bel hôtel.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/hotel.jpg" },
  { "id": "card-47", "englishWord": "Television", "spanishTranslation": "Televisión", "frenchTranslation": "Télévision", "englishSentence": "I watch television in the evening.", "spanishSentence": "Veo televisión por la noche.", "frenchSentence": "Je regarde la télévision le soir.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/television.jpg" },
  { "id": "card-48", "englishWord": "Train", "spanishTranslation": "Tren", "frenchTranslation": "Train", "englishSentence": "I travel to work by train.", "spanishSentence": "Viajo al trabajo en tren.", "frenchSentence": "Je vais au travail en train.", "categoryIds": ["transport"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/train.jpg" },
  { "id": "card-49", "englishWord": "Cake", "spanishTranslation": "Pastel", "frenchTranslation": "Gâteau", "englishSentence": "I love eating chocolate cake.", "spanishSentence": "Me encanta comer pastel de chocolate.", "frenchSentence": "J'adore manger du gâteau au chocolat.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/cake.jpg" },
  { "id": "card-50", "englishWord": "Fish", "spanishTranslation": "Pescado", "frenchTranslation": "Poisson", "englishSentence": "We have fish for dinner.", "spanishSentence": "Tenemos pescado para la cena.", "frenchSentence": "Nous avons du poisson pour le dîner.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/fish.jpg" },
  { "id": "card-51", "englishWord": "Milk", "spanishTranslation": "Leche", "frenchTranslation": "Lait", "englishSentence": "I drink milk every morning.", "spanishSentence": "Bebo leche todas las mañanas.", "frenchSentence": "Je bois du lait chaque matin.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/milk.jpg" },
  { "id": "card-52", "englishWord": "Laptop", "spanishTranslation": "Portátil", "frenchTranslation": "Ordinateur portable", "englishSentence": "I work on my laptop.", "spanishSentence": "Trabajo en mi portátil.", "frenchSentence": "Je travaille sur mon ordinateur portable.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/laptop.jpg" },
  { "id": "card-53", "englishWord": "Picture", "spanishTranslation": "Foto", "frenchTranslation": "Image", "englishSentence": "She is taking a picture.", "spanishSentence": "Ella está tomando una foto.", "frenchSentence": "Elle prend une photo.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/picture.jpg" },
  { "id": "card-54", "englishWord": "To eat", "spanishTranslation": "Comer", "frenchTranslation": "Manger", "englishSentence": "I eat breakfast every morning.", "spanishSentence": "Como el desayuno todas las mañanas.", "frenchSentence": "Je prends le petit déjeuner tous les matins.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-eat.jpg" },
  { "id": "card-55", "englishWord": "To drink", "spanishTranslation": "Beber", "frenchTranslation": "Boire", "englishSentence": "I drink water every day.", "spanishSentence": "Bebo agua todos los días.", "frenchSentence": "Je bois de l'eau tous les jours.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-drink.jpg" },
  { "id": "card-56", "englishWord": "To sleep", "spanishTranslation": "Dormir", "frenchTranslation": "Dormir", "englishSentence": "I sleep eight hours a night.", "spanishSentence": "Duermo ocho horas por noche.", "frenchSentence": "Je dors huit heures par nuit.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-sleep.jpg" },
  { "id": "card-57", "englishWord": "To read", "spanishTranslation": "Leer", "frenchTranslation": "Lire", "englishSentence": "I read a book every week.", "spanishSentence": "Leo un libro todas las semanas.", "frenchSentence": "Je lis un livre chaque semaine.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-read.jpg" },
  { "id": "card-58", "englishWord": "To write", "spanishTranslation": "Escribir", "frenchTranslation": "Écrire", "englishSentence": "I write a letter to my friend.", "spanishSentence": "Escribo una carta a mi amigo.", "frenchSentence": "J'écris une lettre à mon ami.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-write.jpg" },
  { "id": "card-59", "englishWord": "To play", "spanishTranslation": "Jugar", "frenchTranslation": "Jouer", "englishSentence": "I play football with my friends.", "spanishSentence": "Juego al fútbol con mis amigos.", "frenchSentence": "Je joue au football avec mes amis.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-play.jpg" },
  { "id": "card-60", "englishWord": "To work", "spanishTranslation": "Trabajar", "frenchTranslation": "Travailler", "englishSentence": "I work in an office.", "spanishSentence": "Trabajo en una oficina.", "frenchSentence": "Je travaille dans un bureau.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-work.jpg" },
  { "id": "card-61", "englishWord": "To study", "spanishTranslation": "Estudiar", "frenchTranslation": "Étudier", "englishSentence": "I study Spanish every day.", "spanishSentence": "Estudio español todos los días.", "frenchSentence": "J'étudie l'espagnol tous les jours.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-study.jpg" },
  { "id": "card-62", "englishWord": "To go", "spanishTranslation": "Ir", "frenchTranslation": "Aller", "englishSentence": "I go to the cinema on Saturdays.", "spanishSentence": "Voy al cine los sábados.", "frenchSentence": "Je vais au cinéma le samedi.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-go.jpg" },
  { "id": "card-63", "englishWord": "To come", "spanishTranslation": "Venir", "frenchTranslation": "Venir", "englishSentence": "My friend is coming to my house.", "spanishSentence": "Mi amigo viene a mi casa.", "frenchSentence": "Mon ami vient chez moi.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-come.jpg" },
  { "id": "card-64", "englishWord": "To have", "spanishTranslation": "Tener", "frenchTranslation": "Avoir", "englishSentence": "I have a car.", "spanishSentence": "Tengo un coche.", "frenchSentence": "J'ai une voiture.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-have.jpg" },
  { "id": "card-65", "englishWord": "To do", "spanishTranslation": "Hacer", "frenchTranslation": "Faire", "englishSentence": "I do my homework in the afternoon.", "spanishSentence": "Hago mis deberes por la tarde.", "frenchSentence": "Je fais mes devoirs l'après-midi.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-do.jpg" },
  { "id": "card-66", "englishWord": "To say", "spanishTranslation": "Decir", "frenchTranslation": "Dire", "englishSentence": "I say hello to my friends.", "spanishSentence": "Digo hola a mis amigos.", "frenchSentence": "Je dis bonjour à mes amis.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-say.jpg" },
  { "id": "card-67", "englishWord": "To get", "spanishTranslation": "Obtener", "frenchTranslation": "Obtenir", "englishSentence": "I get a new book every month.", "spanishSentence": "Obtengo un libro nuevo cada mes.", "frenchSentence": "J'obtiens un nouveau livre chaque mois.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-get.jpg" },
  { "id": "card-68", "englishWord": "To make", "spanishTranslation": "Hacer", "frenchTranslation": "Faire", "englishSentence": "I make a cake for my birthday.", "spanishSentence": "Hago un pastel para mi cumpleaños.", "frenchSentence": "Je fais un gâteau pour mon anniversaire.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-make.jpg" },
  { "id": "card-69", "englishWord": "To take", "spanishTranslation": "Tomar", "frenchTranslation": "Prendre", "englishSentence": "I take a photo of the landscape.", "spanishSentence": "Tomo una foto del paisaje.", "frenchSentence": "Je prends une photo du paysage.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-take.jpg" },
  { "id": "card-70", "englishWord": "To give", "spanishTranslation": "Dar", "frenchTranslation": "Donner", "englishSentence": "I give a gift to my friend.", "spanishSentence": "Doy un regalo a mi amigo.", "frenchSentence": "Je donne un cadeau à mon ami.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-give.jpg" },
  { "id": "card-71", "englishWord": "To look", "spanishTranslation": "Mirar", "frenchTranslation": "Regarder", "englishSentence": "I look at the sky.", "spanishSentence": "Miro al cielo.", "frenchSentence": "Je regarde le ciel.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-look.jpg" },
  { "id": "card-72", "englishWord": "To find", "spanishTranslation": "Encontrar", "frenchTranslation": "Trouver", "englishSentence": "I find the key.", "spanishSentence": "Encuentro la llave.", "frenchSentence": "Je trouve la clé.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-find.jpg" },
  { "id": "card-73", "englishWord": "To swim", "spanishTranslation": "Nadar", "frenchTranslation": "Nager", "englishSentence": "I like to swim in the sea.", "spanishSentence": "Me gusta nadar en el mar.", "frenchSentence": "J'aime nager dans la mer.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-swim.jpg" },
  { "id": "card-74", "englishWord": "To run", "spanishTranslation": "Correr", "frenchTranslation": "Courir", "englishSentence": "I run in the park every morning.", "spanishSentence": "Corro en el parque todas las mañanas.", "frenchSentence": "Je cours dans le parc tous les matins.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-run.jpg" },
  { "id": "card-75", "englishWord": "To walk", "spanishTranslation": "Caminar", "frenchTranslation": "Marcher", "englishSentence": "I walk to work every day.", "spanishSentence": "Camino al trabajo todos los días.", "frenchSentence": "Je vais au travail à pied tous les jours.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-walk.jpg" },
  { "id": "card-76", "englishWord": "To see", "spanishTranslation": "Ver", "frenchTranslation": "Voir", "englishSentence": "I see a bird in the tree.", "spanishSentence": "Veo un pájaro en el árbol.", "frenchSentence": "Je vois un oiseau dans l'arbre.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-see.jpg" },
  { "id": "card-77", "englishWord": "To hear", "spanishTranslation": "Oír", "frenchTranslation": "Entendre", "englishSentence": "I hear the music.", "spanishSentence": "Oigo la música.", "frenchSentence": "J'entends la musique.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-hear.jpg" },
  { "id": "card-78", "englishWord": "To speak", "spanishTranslation": "Hablar", "frenchTranslation": "Parler", "englishSentence": "I speak Spanish and English.", "spanishSentence": "Hablo español e inglés.", "frenchSentence": "Je parle espagnol et anglais.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-speak.jpg" },
  { "id": "card-79", "englishWord": "To listen", "spanishTranslation": "Escuchar", "frenchTranslation": "Écouter", "englishSentence": "I listen to music every day.", "spanishSentence": "Escucho música todos los días.", "frenchSentence": "J'écoute de la musique tous les jours.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-listen.jpg" },
  { "id": "card-80", "englishWord": "To think", "spanishTranslation": "Pensar", "frenchTranslation": "Penser", "englishSentence": "I think, therefore I am.", "spanishSentence": "Pienso, luego existo.", "frenchSentence": "Je pense, donc je suis.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-think.jpg" },
  { "id": "card-81", "englishWord": "To know", "spanishTranslation": "Saber", "frenchTranslation": "Savoir", "englishSentence": "I know the answer.", "spanishSentence": "Sé la respuesta.", "frenchSentence": "Je connais la réponse.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-know.jpg" },
  { "id": "card-82", "englishWord": "To want", "spanishTranslation": "Querer", "frenchTranslation": "Vouloir", "englishSentence": "I want a glass of water.", "spanishSentence": "Quiero un vaso de agua.", "frenchSentence": "Je veux un verre d'eau.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-want.jpg" },
  { "id": "card-83", "englishWord": "To need", "spanishTranslation": "Necesitar", "frenchTranslation": "Avoir besoin de", "englishSentence": "I need help.", "spanishSentence": "Necesito ayuda.", "frenchSentence": "J'ai besoin d'aide.", "categoryIds": ["verbs"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/verb-need.jpg" },  
  { "id": "card-84", "englishWord": "Mountain", "spanishTranslation": "Montaña", "frenchTranslation": "Montagne", "englishSentence": "We climbed the mountain.", "spanishSentence": "Subimos la montaña.", "frenchSentence": "Nous avons grimpé la montagne.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/mountain.jpg" },
  { "id": "card-85", "englishWord": "Beach", "spanishTranslation": "Playa", "frenchTranslation": "Plage", "englishSentence": "The beach is beautiful.", "spanishSentence": "La playa es hermosa.", "frenchSentence": "La plage est belle.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/beach.jpg" },
  { "id": "card-86", "englishWord": "Orange", "spanishTranslation": "Naranja", "frenchTranslation": "Orange", "englishSentence": "I eat an orange every morning.", "spanishSentence": "Como una naranja cada mañana.", "frenchSentence": "Je mange une orange chaque matin.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/orange.jpg" },
  { "id": "card-87", "englishWord": "Banana", "spanishTranslation": "Banana", "frenchTranslation": "Banane", "englishSentence": "This banana is ripe.", "spanishSentence": "Esta banana está madura.", "frenchSentence": "Cette banane est mûre.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/banana.jpg" },
  { "id": "card-88", "englishWord": "Kitchen", "spanishTranslation": "Cocina", "frenchTranslation": "Cuisine", "englishSentence": "The kitchen is clean.", "spanishSentence": "La cocina está limpia.", "frenchSentence": "La cuisine est propre.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/kitchen.jpg" },
  { "id": "card-89", "englishWord": "Schoolbag", "spanishTranslation": "Mochila escolar", "frenchTranslation": "Cartable", "englishSentence": "I carry books in my schoolbag.", "spanishSentence": "Llevo libros en mi mochila escolar.", "frenchSentence": "Je porte des livres dans mon cartable.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/schoolbag.jpg" },
  { "id": "card-90", "englishWord": "Plant", "spanishTranslation": "Planta", "frenchTranslation": "Plante", "englishSentence": "This plant needs water.", "spanishSentence": "Esta planta necesita agua.", "frenchSentence": "Cette plante a besoin d'eau.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/plant.jpg" },
  { "id": "card-91", "englishWord": "Bottle", "spanishTranslation": "Botella", "frenchTranslation": "Bouteille", "englishSentence": "He drinks from a bottle.", "spanishSentence": "Él bebe de una botella.", "frenchSentence": "Il boit d'une bouteille.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bottle.jpg" },
  { "id": "card-92", "englishWord": "Doorbell", "spanishTranslation": "Timbre", "frenchTranslation": "Sonnette", "englishSentence": "I rang the doorbell.", "spanishSentence": "Toqué el timbre.", "frenchSentence": "J'ai sonné à la sonnette.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/doorbell.jpg" },
  { "id": "card-93", "englishWord": "Bedside lamp", "spanishTranslation": "Lámpara de noche", "frenchTranslation": "Lampe de chevet", "englishSentence": "Turn on the bedside lamp.", "spanishSentence": "Enciende la lámpara de noche.", "frenchSentence": "Allume la lampe de chevet.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bedside-lamp.jpg" },
  { "id": "card-94", "englishWord": "Glasses", "spanishTranslation": "Lentes", "frenchTranslation": "Lunettes", "englishSentence": "She wears glasses.", "spanishSentence": "Ella usa lentes.", "frenchSentence": "Elle porte des lunettes.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/glasses.jpg" },
  { "id": "card-95", "englishWord": "Snow", "spanishTranslation": "Nieve", "frenchTranslation": "Neige", "englishSentence": "The snow is falling.", "spanishSentence": "Está nevando.", "frenchSentence": "Il neige.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/snow.jpg" },
  { "id": "card-96", "englishWord": "Toothbrush", "spanishTranslation": "Cepillo de dientes", "frenchTranslation": "Brosse à dents", "englishSentence": "I use a toothbrush every morning.", "spanishSentence": "Uso un cepillo de dientes todas las mañanas.", "frenchSentence": "J'utilise une brosse à dents chaque matin.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/toothbrush.jpg" },
  { "id": "card-97", "englishWord": "Mirror", "spanishTranslation": "Espejo", "frenchTranslation": "Miroir", "englishSentence": "He looked at himself in the mirror.", "spanishSentence": "Se miró en el espejo.", "frenchSentence": "Il s'est regardé dans le miroir.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/mirror.jpg" },
  { "id": "card-98", "englishWord": "Envelope", "spanishTranslation": "Sobre", "frenchTranslation": "Enveloppe", "englishSentence": "I put the letter in the envelope.", "spanishSentence": "Puse la carta en el sobre.", "frenchSentence": "J'ai mis la lettre dans l'enveloppe.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/envelope.jpg" },
  { "id": "card-99", "englishWord": "Market", "spanishTranslation": "Mercado", "frenchTranslation": "Marché", "englishSentence": "We went to the market.", "spanishSentence": "Fuimos al mercado.", "frenchSentence": "Nous sommes allés au marché.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/market.jpg" },
  { "id": "card-100", "englishWord": "Leaf", "spanishTranslation": "Hoja", "frenchTranslation": "Feuille", "englishSentence": "The leaf is green.", "spanishSentence": "La hoja es verde.", "frenchSentence": "La feuille est verte.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/leaf.jpg" },
  { "id": "card-101", "englishWord": "Cloud", "spanishTranslation": "Nube", "frenchTranslation": "Nuage", "englishSentence": "There is a cloud in the sky.", "spanishSentence": "Hay una nube en el cielo.", "frenchSentence": "Il y a un nuage dans le ciel.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/cloud.jpg" },
  { "id": "card-102", "englishWord": "Desk", "spanishTranslation": "Escritorio", "frenchTranslation": "Bureau", "englishSentence": "My computer is on the desk.", "spanishSentence": "Mi computadora está en el escritorio.", "frenchSentence": "Mon ordinateur est sur le bureau.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/desk.jpg" },
  { "id": "card-103", "englishWord": "Wallet", "spanishTranslation": "Cartera", "frenchTranslation": "Portefeuille", "englishSentence": "My wallet is in my bag.", "spanishSentence": "Mi cartera está en mi bolsa.", "frenchSentence": "Mon portefeuille est dans mon sac.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/wallet.jpg" },
  { "id": "card-104", "englishWord": "Fan", "spanishTranslation": "Ventilador", "frenchTranslation": "Ventilateur", "englishSentence": "The fan is on.", "spanishSentence": "El ventilador está encendido.", "frenchSentence": "Le ventilateur est allumé.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/fan.jpg" },
  { "id": "card-105", "englishWord": "Backpack", "spanishTranslation": "Mochila", "frenchTranslation": "Sac à dos", "englishSentence": "I carry my books in a backpack.", "spanishSentence": "Llevo mis libros en una mochila.", "frenchSentence": "Je porte mes livres dans un sac à dos.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/backpack.jpg" },
  { "id": "card-106", "englishWord": "Stairs", "spanishTranslation": "Escaleras", "frenchTranslation": "Escalier", "englishSentence": "I go up the stairs.", "spanishSentence": "Subo las escaleras.", "frenchSentence": "Je monte les escaliers.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/stairs.jpg" },
  { "id": "card-107", "englishWord": "Road", "spanishTranslation": "Carretera", "frenchTranslation": "Route", "englishSentence": "The road is long.", "spanishSentence": "La carretera es larga.", "frenchSentence": "La route est longue.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/road.jpg" },
  { "id": "card-108", "englishWord": "Bridge", "spanishTranslation": "Puente", "frenchTranslation": "Pont", "englishSentence": "The bridge is made of stone.", "spanishSentence": "El puente es de piedra.", "frenchSentence": "Le pont est en pierre.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bridge.jpg" },
  { "id": "card-109", "englishWord": "Moon", "spanishTranslation": "Luna", "frenchTranslation": "Lune", "englishSentence": "The moon is bright tonight.", "spanishSentence": "La luna está brillante esta noche.", "frenchSentence": "La lune est brillante ce soir.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/moon.jpg" },
  { "id": "card-110", "englishWord": "Star", "spanishTranslation": "Estrella", "frenchTranslation": "Étoile", "englishSentence": "I see a star in the sky.", "spanishSentence": "Veo una estrella en el cielo.", "frenchSentence": "Je vois une étoile dans le ciel.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/star.jpg" },
  { "id": "card-111", "englishWord": "Rock", "spanishTranslation": "Roca", "frenchTranslation": "Roche", "englishSentence": "The rock is heavy.", "spanishSentence": "La roca es pesada.", "frenchSentence": "La roche est lourde.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/rock.jpg" },
  { "id": "card-112", "englishWord": "Fire", "spanishTranslation": "Fuego", "frenchTranslation": "Feu", "englishSentence": "The fire is warm.", "spanishSentence": "El fuego es cálido.", "frenchSentence": "Le feu est chaud.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/fire.jpg" },
  { "id": "card-114", "englishWord": "Pan", "spanishTranslation": "Sartén", "frenchTranslation": "Poêle", "englishSentence": "The pan is hot.", "spanishSentence": "La sartén está caliente.", "frenchSentence": "La poêle est chaude.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/pan.jpg" },
  { "id": "card-115", "englishWord": "Fork", "spanishTranslation": "Tenedor", "frenchTranslation": "Fourchette", "englishSentence": "I eat with a fork.", "spanishSentence": "Como con un tenedor.", "frenchSentence": "Je mange avec une fourchette.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/fork.jpg" },
  { "id": "card-116", "englishWord": "Knife", "spanishTranslation": "Cuchillo", "frenchTranslation": "Couteau", "englishSentence": "Be careful with the knife.", "spanishSentence": "Ten cuidado con el cuchillo.", "frenchSentence": "Fais attention avec le couteau.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/knife.jpg" },
  { "id": "card-117", "englishWord": "Spoon", "spanishTranslation": "Cuchara", "frenchTranslation": "Cuillère", "englishSentence": "She eats with a spoon.", "spanishSentence": "Ella come con una cuchara.", "frenchSentence": "Elle mange avec une cuillère.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/spoon.jpg" },
  { "id": "card-118", "englishWord": "Plate", "spanishTranslation": "Plato", "frenchTranslation": "Assiette", "englishSentence": "The plate is clean.", "spanishSentence": "El plato está limpio.", "frenchSentence": "L'assiette est propre.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/plate.jpg" },
  { "id": "card-119", "englishWord": "Napkin", "spanishTranslation": "Servilleta", "frenchTranslation": "Serviette", "englishSentence": "Use a napkin, please.", "spanishSentence": "Usa una servilleta, por favor.", "frenchSentence": "Utilise une serviette, s'il te plaît.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/napkin.jpg" },
  { "id": "card-120", "englishWord": "Horse", "spanishTranslation": "Caballo", "frenchTranslation": "Cheval", "englishSentence": "The horse runs fast.", "spanishSentence": "El caballo corre rápido.", "frenchSentence": "Le cheval court vite.", "categoryIds": ["animals"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/horse.jpg" },
  { "id": "card-121", "englishWord": "Sofa", "spanishTranslation": "Sofá", "frenchTranslation": "Canapé", "englishSentence": "They are sitting on the sofa.", "spanishSentence": "Están sentados en el sofá.", "frenchSentence": "Ils sont assis sur le canapé.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/sofa.jpg" },
  { "id": "card-122", "englishWord": "Curtain", "spanishTranslation": "Cortina", "frenchTranslation": "Rideau", "englishSentence": "The curtain is red.", "spanishSentence": "La cortina es roja.", "frenchSentence": "Le rideau est rouge.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/curtain.jpg" },
  { "id": "card-123", "englishWord": "Ceiling", "spanishTranslation": "Techo (interior)", "frenchTranslation": "Plafond", "englishSentence": "The ceiling is high.", "spanishSentence": "El techo es alto.", "frenchSentence": "Le plafond est haut.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/ceiling.jpg" },
  { "id": "card-124", "englishWord": "Wall", "spanishTranslation": "Pared", "frenchTranslation": "Mur", "englishSentence": "There is a painting on the wall.", "spanishSentence": "Hay un cuadro en la pared.", "frenchSentence": "Il y a un tableau sur le mur.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/wall.jpg" },
  { "id": "card-125", "englishWord": "Floor", "spanishTranslation": "Piso", "frenchTranslation": "Sol", "englishSentence": "The floor is clean.", "spanishSentence": "El piso está limpio.", "frenchSentence": "Le sol est propre.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/floor.jpg" },
  { "id": "card-127", "englishWord": "Light", "spanishTranslation": "Luz", "frenchTranslation": "Lumière", "englishSentence": "Turn off the light.", "spanishSentence": "Apaga la luz.", "frenchSentence": "Éteins la lumière.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/light.jpg" },
  { "id": "card-129", "englishWord": "Toothpaste", "spanishTranslation": "Pasta de dientes", "frenchTranslation": "Dentifrice", "englishSentence": "Put toothpaste on the brush.", "spanishSentence": "Pon pasta de dientes en el cepillo.", "frenchSentence": "Mets du dentifrice sur la brosse.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/toothpaste.jpg" },
  { "id": "card-130", "englishWord": "Soap", "spanishTranslation": "Jabón", "frenchTranslation": "Savon", "englishSentence": "Wash your hands with soap.", "spanishSentence": "Lávate las manos con jabón.", "frenchSentence": "Lave-toi les mains avec du savon.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/soap.jpg" },
  { "id": "card-131", "englishWord": "Office", "spanishTranslation": "Oficina", "frenchTranslation": "Bureau", "englishSentence": "She works in an office.", "spanishSentence": "Ella trabaja en una oficina.", "frenchSentence": "Elle travaille dans un bureau.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/office.jpg" },
  { "id": "card-132", "englishWord": "Job", "spanishTranslation": "Trabajo", "frenchTranslation": "Emploi", "englishSentence": "He has a new job.", "spanishSentence": "Él tiene un nuevo trabajo.", "frenchSentence": "Il a un nouvel emploi.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/job.jpg" },
  { "id": "card-133", "englishWord": "Boss", "spanishTranslation": "Jefe", "frenchTranslation": "Patron", "englishSentence": "The boss is in a meeting.", "spanishSentence": "El jefe está en una reunión.", "frenchSentence": "Le patron est en réunion.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/boss.jpg" },
  { "id": "card-134", "englishWord": "Money", "spanishTranslation": "Dinero", "frenchTranslation": "Argent", "englishSentence": "She saves her money.", "spanishSentence": "Ella ahorra su dinero.", "frenchSentence": "Elle économise son argent.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/money.jpg" },
  { "id": "card-135", "englishWord": "Meeting", "spanishTranslation": "Reunión", "frenchTranslation": "Réunion", "englishSentence": "We have a meeting today.", "spanishSentence": "Tenemos una reunión hoy.", "frenchSentence": "Nous avons une réunion aujourd'hui.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/meeting.jpg" },
  { "id": "card-136", "englishWord": "Email", "spanishTranslation": "Correo electrónico", "frenchTranslation": "Email", "englishSentence": "I sent an email.", "spanishSentence": "Envié un correo electrónico.", "frenchSentence": "J'ai envoyé un email.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/email.jpg" },
  { "id": "card-137", "englishWord": "Phonecall", "spanishTranslation": "Llamada", "frenchTranslation": "Appel", "englishSentence": "She makes a phonecall.", "spanishSentence": "Ella hace una llamada.", "frenchSentence": "Elle passe un appel.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/phonecall.jpg" },
  { "id": "card-138", "englishWord": "Rabbit", "spanishTranslation": "Conejo", "frenchTranslation": "Lapin", "englishSentence": "The rabbit eats a carrot.", "spanishSentence": "El conejo come una zanahoria.", "frenchSentence": "Le lapin mange une carotte.", "categoryIds": ["animals"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/rabbit.jpg" },
  { "id": "card-139", "englishWord": "Paper", "spanishTranslation": "Papel", "frenchTranslation": "Papier", "englishSentence": "The paper is white.", "spanishSentence": "El papel es blanco.", "frenchSentence": "Le papier est blanc.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/paper.jpg" },
  { "id": "card-140", "englishWord": "Cow", "spanishTranslation": "Vaca", "frenchTranslation": "Vache", "englishSentence": "The cow is in the field.", "spanishSentence": "La vaca está en el campo.", "frenchSentence": "La vache est dans le champ.", "categoryIds": ["animals"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/cow.jpg" },
  { "id": "card-141", "englishWord": "Team", "spanishTranslation": "Equipo", "frenchTranslation": "Équipe", "englishSentence": "We are a good team.", "spanishSentence": "Somos un buen equipo.", "frenchSentence": "Nous sommes une bonne équipe.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/team.jpg" },
  { "id": "card-142", "englishWord": "Sale", "spanishTranslation": "Venta", "frenchTranslation": "Vente", "englishSentence": "The sale was successful.", "spanishSentence": "La venta fue exitosa.", "frenchSentence": "La vente a été réussie.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/sale.jpg" },
  { "id": "card-143", "englishWord": "Client", "spanishTranslation": "Cliente", "frenchTranslation": "Client", "englishSentence": "The client is happy.", "spanishSentence": "El cliente está feliz.", "frenchSentence": "Le client est content.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/client.jpg" },
  { "id": "card-144", "englishWord": "Invoice", "spanishTranslation": "Factura", "frenchTranslation": "Facture", "englishSentence": "This is your invoice.", "spanishSentence": "Esta es tu factura.", "frenchSentence": "Ceci est votre facture.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/invoice.jpg" },
  { "id": "card-145", "englishWord": "Report", "spanishTranslation": "Informe", "frenchTranslation": "Rapport", "englishSentence": "He wrote the report.", "spanishSentence": "Él escribió el informe.", "frenchSentence": "Il a écrit le rapport.", "categoryIds": ["business"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/report.jpg" },
  { "id": "card-146", "englishWord": "Happy", "spanishTranslation": "Feliz", "frenchTranslation": "Heureux", "englishSentence": "She feels happy today.", "spanishSentence": "Ella se siente feliz hoy.", "frenchSentence": "Elle se sent heureuse aujourd'hui.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/happy.jpg" },
  { "id": "card-147", "englishWord": "Sad", "spanishTranslation": "Triste", "frenchTranslation": "Triste", "englishSentence": "He looks sad.", "spanishSentence": "Él parece triste.", "frenchSentence": "Il a l'air triste.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/sad.jpg" },
  { "id": "card-148", "englishWord": "Angry", "spanishTranslation": "Enojado", "frenchTranslation": "En colère", "englishSentence": "They are angry about the news.", "spanishSentence": "Están enojados por la noticia.", "frenchSentence": "Ils sont en colère à cause de la nouvelle.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/angry.jpg" },
  { "id": "card-149", "englishWord": "Excited", "spanishTranslation": "Emocionado", "frenchTranslation": "Excité", "englishSentence": "She is excited for the trip.", "spanishSentence": "Ella está emocionada por el viaje.", "frenchSentence": "Elle est excitée pour le voyage.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/excited.jpg" },
  { "id": "card-150", "englishWord": "Scared", "spanishTranslation": "Asustado", "frenchTranslation": "Effrayé", "englishSentence": "The child is scared of the dark.", "spanishSentence": "El niño tiene miedo de la oscuridad.", "frenchSentence": "L'enfant a peur du noir.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/scared.jpg" },
  { "id": "card-151", "englishWord": "Tired", "spanishTranslation": "Cansado", "frenchTranslation": "Fatigué", "englishSentence": "I feel tired after work.", "spanishSentence": "Me siento cansado después del trabajo.", "frenchSentence": "Je me sens fatigué après le travail.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/tired.jpg" },
  { "id": "card-152", "englishWord": "Calm", "spanishTranslation": "Calmado", "frenchTranslation": "Calme", "englishSentence": "The lake is calm today.", "spanishSentence": "El lago está calmado hoy.", "frenchSentence": "Le lac est calme aujourd'hui.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/calm.jpg" },
  { "id": "card-153", "englishWord": "Nervous", "spanishTranslation": "Nervioso", "frenchTranslation": "Nerveux", "englishSentence": "He is nervous before the exam.", "spanishSentence": "Él está nervioso antes del examen.", "frenchSentence": "Il est nerveux avant l'examen.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/nervous.jpg" },
  { "id": "card-154", "englishWord": "Bored", "spanishTranslation": "Aburrido", "frenchTranslation": "Ennuyé", "englishSentence": "She feels bored in class.", "spanishSentence": "Ella se siente aburrida en clase.", "frenchSentence": "Elle s'ennuie en classe.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bored.jpg" },
  { "id": "card-155", "englishWord": "Lonely", "spanishTranslation": "Solitario", "frenchTranslation": "Seul", "englishSentence": "He feels lonely at home.", "spanishSentence": "Él se siente solitario en casa.", "frenchSentence": "Il se sent seul à la maison.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/lonely.jpg" },
  { "id": "card-156", "englishWord": "Surprised", "spanishTranslation": "Sorprendido", "frenchTranslation": "Surpris", "englishSentence": "They were surprised by the gift.", "spanishSentence": "Ellos estaban sorprendidos por el regalo.", "frenchSentence": "Ils étaient surpris par le cadeau.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/surprised.jpg" },
  { "id": "card-157", "englishWord": "Confused", "spanishTranslation": "Confundido", "frenchTranslation": "Confus", "englishSentence": "I am confused by the question.", "spanishSentence": "Estoy confundido por la pregunta.", "frenchSentence": "Je suis confus par la question.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/confused.jpg" },
  { "id": "card-158", "englishWord": "Proud", "spanishTranslation": "Orgulloso", "frenchTranslation": "Fier", "englishSentence": "She is proud of her work.", "spanishSentence": "Ella está orgullosa de su trabajo.", "frenchSentence": "Elle est fière de son travail.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/proud.jpg" },
  { "id": "card-159", "englishWord": "Shy", "spanishTranslation": "Tímido", "frenchTranslation": "Timide", "englishSentence": "He is shy around new people.", "spanishSentence": "Él es tímido con gente nueva.", "frenchSentence": "Il est timide avec de nouvelles personnes.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/shy.jpg" },
  { "id": "card-160", "englishWord": "Friendly", "spanishTranslation": "Amigable", "frenchTranslation": "Amical", "englishSentence": "She is friendly to everyone.", "spanishSentence": "Ella es amigable con todos.", "frenchSentence": "Elle est amicale avec tout le monde.", "categoryIds": ["emotions"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/friendly.jpg" },
  { "id": "card-161", "englishWord": "January", "spanishTranslation": "Enero", "frenchTranslation": "Janvier", "englishSentence": "January is the first month of the year.", "spanishSentence": "Enero es el primer mes del año.", "frenchSentence": "Janvier est le premier mois de l'année.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/january.jpg" },
{ "id": "card-162", "englishWord": "February", "spanishTranslation": "Febrero", "frenchTranslation": "Février", "englishSentence": "February is the shortest month.", "spanishSentence": "Febrero es el mes más corto.", "frenchSentence": "Février est le mois le plus court.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/february.jpg" },
{ "id": "card-163", "englishWord": "March", "spanishTranslation": "Marzo", "frenchTranslation": "Mars", "englishSentence": "Spring begins in March.", "spanishSentence": "La primavera comienza en marzo.", "frenchSentence": "Le printemps commence en mars.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/march.jpg" },
{ "id": "card-164", "englishWord": "April", "spanishTranslation": "Abril", "frenchTranslation": "Avril", "englishSentence": "It rains a lot in April.", "spanishSentence": "Llueve mucho en abril.", "frenchSentence": "Il pleut beaucoup en avril.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/april.jpg" },
{ "id": "card-165", "englishWord": "May", "spanishTranslation": "Mayo", "frenchTranslation": "Mai", "englishSentence": "Flowers bloom in May.", "spanishSentence": "Las flores florecen en mayo.", "frenchSentence": "Les fleurs fleurissent en mai.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/may.jpg" },
{ "id": "card-166", "englishWord": "June", "spanishTranslation": "Junio", "frenchTranslation": "Juin", "englishSentence": "School ends in June.", "spanishSentence": "La escuela termina en junio.", "frenchSentence": "L'école se termine en juin.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/june.jpg" },
{ "id": "card-167", "englishWord": "July", "spanishTranslation": "Julio", "frenchTranslation": "Juillet", "englishSentence": "July is very hot.", "spanishSentence": "Julio es muy caluroso.", "frenchSentence": "Juillet est très chaud.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/july.jpg" },
{ "id": "card-168", "englishWord": "August", "spanishTranslation": "Agosto", "frenchTranslation": "Août", "englishSentence": "We travel in August.", "spanishSentence": "Viajamos en agosto.", "frenchSentence": "Nous voyageons en août.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/august.jpg" },
{ "id": "card-169", "englishWord": "September", "spanishTranslation": "Septiembre", "frenchTranslation": "Septembre", "englishSentence": "School starts in September.", "spanishSentence": "La escuela comienza en septiembre.", "frenchSentence": "L'école commence en septembre.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/september.jpg" },
{ "id": "card-170", "englishWord": "October", "spanishTranslation": "Octubre", "frenchTranslation": "Octobre", "englishSentence": "Halloween is in October.", "spanishSentence": "Halloween es en octubre.", "frenchSentence": "Halloween est en octobre.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/october.jpg" },
{ "id": "card-171", "englishWord": "November", "spanishTranslation": "Noviembre", "frenchTranslation": "Novembre", "englishSentence": "November is cold.", "spanishSentence": "Noviembre es frío.", "frenchSentence": "Novembre est froid.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/november.jpg" },
{ "id": "card-172", "englishWord": "December", "spanishTranslation": "Diciembre", "frenchTranslation": "Décembre", "englishSentence": "December has many holidays.", "spanishSentence": "Diciembre tiene muchas festividades.", "frenchSentence": "Décembre a beaucoup de fêtes.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/december.jpg" },
{ "id": "card-173", "englishWord": "Festival", "spanishTranslation": "Festival", "frenchTranslation": "Festival", "englishSentence": "We went to a music festival.", "spanishSentence": "Fuimos a un festival de música.", "frenchSentence": "Nous sommes allés à un festival de musique.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/festival.jpg" },
{ "id": "card-174", "englishWord": "Honey", "spanishTranslation": "Miel", "frenchTranslation": "Miel", "englishSentence": "I like honey in my tea.", "spanishSentence": "Me gusta la miel en mi té.", "frenchSentence": "J'aime le miel dans mon thé.", "categoryIds": ["food"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/honey.jpg" },
{ "id": "card-175", "englishWord": "Lantern", "spanishTranslation": "Linterna", "frenchTranslation": "Lanterne", "englishSentence": "The lantern lights the path.", "spanishSentence": "La linterna ilumina el camino.", "frenchSentence": "La lanterne éclaire le chemin.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/lantern.jpg" },
{ "id": "card-176", "englishWord": "Hour", "spanishTranslation": "Hora", "frenchTranslation": "Heure", "englishSentence": "There are 24 hours in a day.", "spanishSentence": "Hay 24 horas en un día.", "frenchSentence": "Il y a 24 heures dans une journée.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/hour.jpg" },
{ "id": "card-177", "englishWord": "Minute", "spanishTranslation": "Minuto", "frenchTranslation": "Minute", "englishSentence": "A minute has 60 seconds.", "spanishSentence": "Un minuto tiene 60 segundos.", "frenchSentence": "Une minute a 60 secondes.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/minute.jpg" },
{ "id": "card-178", "englishWord": "Second", "spanishTranslation": "Segundo", "frenchTranslation": "Seconde", "englishSentence": "Wait a second, please.", "spanishSentence": "Espera un segundo, por favor.", "frenchSentence": "Attends une seconde, s'il te plaît.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/second.jpg" },
{ "id": "card-179", "englishWord": "Morning", "spanishTranslation": "Mañana", "frenchTranslation": "Matin", "englishSentence": "I wake up in the morning.", "spanishSentence": "Me despierto en la mañana.", "frenchSentence": "Je me réveille le matin.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/morning.jpg" },
{ "id": "card-180", "englishWord": "Afternoon", "spanishTranslation": "Tarde", "frenchTranslation": "Après-midi", "englishSentence": "We play in the afternoon.", "spanishSentence": "Jugamos en la tarde.", "frenchSentence": "Nous jouons l'après-midi.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/afternoon.jpg" },
{ "id": "card-181", "englishWord": "Evening", "spanishTranslation": "Noche", "frenchTranslation": "Soir", "englishSentence": "I watch TV in the evening.", "spanishSentence": "Veo televisión en la noche.", "frenchSentence": "Je regarde la télévision le soir.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/evening.jpg" },
{ "id": "card-182", "englishWord": "Night", "spanishTranslation": "Noche", "frenchTranslation": "Nuit", "englishSentence": "The stars shine at night.", "spanishSentence": "Las estrellas brillan en la noche.", "frenchSentence": "Les étoiles brillent la nuit.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/night.jpg" },
{ "id": "card-183", "englishWord": "Spring", "spanishTranslation": "Primavera", "frenchTranslation": "Printemps", "englishSentence": "Spring is full of flowers.", "spanishSentence": "La primavera está llena de flores.", "frenchSentence": "Le printemps est plein de fleurs.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/spring.jpg" },
{ "id": "card-184", "englishWord": "Summer", "spanishTranslation": "Verano", "frenchTranslation": "Été", "englishSentence": "We go to the beach in summer.", "spanishSentence": "Vamos a la playa en verano.", "frenchSentence": "Nous allons à la plage en été.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/summer.jpg" },
{ "id": "card-185", "englishWord": "Autumn", "spanishTranslation": "Otoño", "frenchTranslation": "Automne", "englishSentence": "Leaves fall in autumn.", "spanishSentence": "Las hojas caen en otoño.", "frenchSentence": "Les feuilles tombent en automne.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/autumn.jpg" },
{ "id": "card-186", "englishWord": "Winter", "spanishTranslation": "Invierno", "frenchTranslation": "Hiver", "englishSentence": "It snows in winter.", "spanishSentence": "Nieva en invierno.", "frenchSentence": "Il neige en hiver.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/winter.jpg" },
{ "id": "card-187", "englishWord": "Today", "spanishTranslation": "Hoy", "frenchTranslation": "Aujourd'hui", "englishSentence": "Today is a good day.", "spanishSentence": "Hoy es un buen día.", "frenchSentence": "Aujourd'hui est un bon jour.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/today.jpg" },
{ "id": "card-188", "englishWord": "Tomorrow", "spanishTranslation": "Mañana", "frenchTranslation": "Demain", "englishSentence": "We will go tomorrow.", "spanishSentence": "Iremos mañana.", "frenchSentence": "Nous irons demain.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/tomorrow.jpg" },
{ "id": "card-189", "englishWord": "Yesterday", "spanishTranslation": "Ayer", "frenchTranslation": "Hier", "englishSentence": "I studied yesterday.", "spanishSentence": "Estudié ayer.", "frenchSentence": "J'ai étudié hier.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/yesterday.jpg" },
{ "id": "card-190", "englishWord": "Week", "spanishTranslation": "Semana", "frenchTranslation": "Semaine", "englishSentence": "There are seven days in a week.", "spanishSentence": "Hay siete días en una semana.", "frenchSentence": "Il y a sept jours dans une semaine.", "categoryIds": ["time"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/week.jpg" },
{ "id": "card-191", "englishWord": "Windowpane", "spanishTranslation": "Cristal de ventana", "frenchTranslation": "Carreau de fenêtre", "englishSentence": "The rain hit the windowpane.", "spanishSentence": "La lluvia golpeó el cristal de la ventana.", "frenchSentence": "La pluie a frappé le carreau de la fenêtre.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/windowpane.jpg" },
{ "id": "card-192", "englishWord": "Shadow", "spanishTranslation": "Sombra", "frenchTranslation": "Ombre", "englishSentence": "I saw my shadow on the wall.", "spanishSentence": "Vi mi sombra en la pared.", "frenchSentence": "J'ai vu mon ombre sur le mur.", "categoryIds": ["nature"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/shadow.jpg" },
{ "id": "card-193", "englishWord": "Fence", "spanishTranslation": "Valla", "frenchTranslation": "Clôture", "englishSentence": "The dog jumped over the fence.", "spanishSentence": "El perro saltó la valla.", "frenchSentence": "Le chien a sauté par-dessus la clôture.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/fence.jpg" },
{ "id": "card-194", "englishWord": "Bell", "spanishTranslation": "Campana", "frenchTranslation": "Cloche", "englishSentence": "The bell rang loudly.", "spanishSentence": "La campana sonó fuerte.", "frenchSentence": "La cloche a sonné fort.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bell.jpg" },
{ "id": "card-195", "englishWord": "Puzzle", "spanishTranslation": "Rompecabezas", "frenchTranslation": "Puzzle", "englishSentence": "I like to solve puzzles.", "spanishSentence": "Me gusta resolver rompecabezas.", "frenchSentence": "J'aime résoudre des puzzles.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/puzzle.jpg" },
{ "id": "card-196", "englishWord": "Farm", "spanishTranslation": "Granja", "frenchTranslation": "Ferme", "englishSentence": "We visited a farm.", "spanishSentence": "Visitamos una granja.", "frenchSentence": "Nous avons visité une ferme.", "categoryIds": ["places"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/farm.jpg" },
{ "id": "card-197", "englishWord": "Feather", "spanishTranslation": "Pluma", "frenchTranslation": "Plume", "englishSentence": "The bird dropped a feather.", "spanishSentence": "El pájaro soltó una pluma.", "frenchSentence": "L'oiseau a perdu une plume.", "categoryIds": ["animals"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/feather.jpg" },
{ "id": "card-198", "englishWord": "Button", "spanishTranslation": "Botón", "frenchTranslation": "Bouton", "englishSentence": "I lost a button on my shirt.", "spanishSentence": "Perdí un botón de mi camisa.", "frenchSentence": "J'ai perdu un bouton de ma chemise.", "categoryIds": ["clothing"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/button.jpg" },
{ "id": "card-200", "englishWord": "Bench", "spanishTranslation": "Banco", "frenchTranslation": "Banc", "englishSentence": "They sat on the bench in the park.", "spanishSentence": "Se sentaron en el banco del parque.", "frenchSentence": "Ils se sont assis sur le banc dans le parc.", "categoryIds": ["objects"], "isFavorite": false, "level": "A1", "imageUrl": "/images/flashcards/bench.jpg" },
];

const masterCategories: Category[] = [{ id: 'objects', name: 'Objetos', color: '#3b82f6', created_at: new Date().toISOString() },
    { id: 'places', name: 'Lugares', color: '#10b981', created_at: new Date().toISOString() },
    { id: 'animals', name: 'Animales', color: '#f97316', created_at: new Date().toISOString() },
    { id: 'food', name: 'Comida', color: '#ef4444', created_at: new Date().toISOString() },
    { id: 'transport', name: 'Transporte', color: '#eab308', created_at: new Date().toISOString() },
    { id: 'people', name: 'Personas', color: '#ec4899', created_at: new Date().toISOString() },
    { id: 'nature', name: 'Naturaleza', color: '#22c55e', created_at: new Date().toISOString() },
    { id: 'clothing', name: 'Ropa', color: '#64748b', created_at: new Date().toISOString() },
    { id: 'verbs', name: 'Verbos', color: '#c084fc', created_at: new Date().toISOString() },
    { id: 'emotions', name: 'Emociones', color: '#f472b6', created_at: new Date().toISOString() },
    { id: 'business', name: 'Negocios', color: '#14b8a6', created_at: new Date().toISOString() },
    { id: 'grammar', name: 'Gramática', color: '#6366f1', created_at: new Date().toISOString() },
    { id: 'time', name: 'Tiempo', color: '#8B5CF6', created_at: new Date().toISOString() },
  ];

// Versión simplificada del contexto para una app 100% local
interface AppContextType {
  flashcards: Flashcard[];
  categories: Category[];
  activeCategory: string | null;
  searchTerm: string;
  sortOption: SortOption;
  viewMode: ViewMode;
  theme: ThemeConfig;
  studyMode: StudyModeOption;
  studyTargetLanguage: 'spanish' | 'french';
  isLoading: boolean;
  
  setFlashcards: (flashcards: Flashcard[]) => void;
  setCategories: (categories: Category[]) => void;
  setActiveCategory: (categoryId: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setStudyTargetLanguage: (language: 'spanish' | 'french') => void;
  setStudyMode: (mode: StudyModeOption) => void;
  toggleTheme: () => void;
  updateStudyTimerSettings: (enabled: boolean, duration: number) => void;
  updateCardChangeSound: (enabled: boolean) => void;
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'created_at'>) => void;
  updateFlashcard: (id: string, updates: Partial<Omit<Flashcard, 'id' | 'created_at'>>) => void;
  deleteFlashcard: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'created_at'>>) => void;
  deleteCategory: (id: string) => void;
  filteredFlashcards: Flashcard[];
  getFlashcardById: (id: string) => Flashcard | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setCategories(masterCategories);

      const storedFlashcards = localStorage.getItem('flashcards');
      const userFlashcards: Flashcard[] = storedFlashcards ? JSON.parse(storedFlashcards) : [];
      const userFlashcardsMap = new Map(userFlashcards.map(card => [card.id, card]));

      const mergedFlashcards: Flashcard[] = masterFlashcards.map(masterCard => {
        const userCard = userFlashcardsMap.get(masterCard.id);
        const studyProgress = userCard?.studyProgress ?? { level: 1, consecutiveCorrect: 0 };
        const isFavorite = userCard?.isFavorite ?? masterCard.isFavorite;
        
        return { 
          ...masterCard,
          created_at: new Date().toISOString(), // Añadir fecha de creación
          studyProgress,
          isFavorite,
        };
      });
      
      userFlashcards.forEach(userCard => {
          if (!masterFlashcards.some(c => c.id === userCard.id)) {
              mergedFlashcards.push(userCard);
          }
      });

      setFlashcards(mergedFlashcards);

          } catch (error) {
      console.error("Error initializing data, falling back to clean master data.", error);
      const cleanMasterFlashcards: Flashcard[] = masterFlashcards.map(card => ({
        ...card,
        created_at: new Date().toISOString(),
        studyProgress: { level: 1, consecutiveCorrect: 0 }
      }));
      setFlashcards(cleanMasterFlashcards);
      setCategories(masterCategories);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar en localStorage cada vez que cambien los datos
  useEffect(() => {
    if (!isLoading) {
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
      }
  }, [flashcards, isLoading]);

  useEffect(() => {
    if (!isLoading) {
        localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories, isLoading]);


  // Funciones CRUD que operan solo en el estado local y localStorage
  const addFlashcard = (flashcard: Omit<Flashcard, 'id' | 'created_at'>) => {
      const newFlashcard: Flashcard = {
        ...flashcard,
      id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
      studyProgress: {
        level: 1,
        consecutiveCorrect: 0,
      },
      };
      setFlashcards(prev => [...prev, newFlashcard]);
  };

  const updateFlashcard = (id: string, updates: Partial<Omit<Flashcard, 'id' | 'created_at'>>) => {
    setFlashcards(prev => prev.map(card => (card.id === id ? { ...card, ...updates } : card)));
  };

  const deleteFlashcard = (id: string) => {
      setFlashcards(prev => prev.filter(card => card.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setFlashcards(prev => prev.map(card =>
      card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
    ));
  };

  const addCategory = (category: Omit<Category, 'id' | 'created_at'>) => {
    const newCategory: Category = {
      ...category,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Omit<Category, 'id' | 'created_at'>>) => {
    setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Opcional: desasignar la categoría de las flashcards
    setFlashcards(prev => prev.map(card => ({
      ...card,
      categoryIds: card.categoryIds.filter(catId => catId !== id),
    })));
  };
  
  // El resto de los estados y funciones que no dependen de Supabase
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [studyMode, setStudyMode] = useState<StudyModeOption>('audio_image_text');
  const [studyTargetLanguage, setStudyTargetLanguage] = useState<'spanish' | 'french'>(() => {
    const stored = localStorage.getItem('studyTargetLanguage');
    return (stored as 'spanish' | 'french') || 'spanish';
  });

  // Log para depuración: cada vez que cambia el idioma de estudio
  useEffect(() => {
    console.log('[AppContext] studyTargetLanguage state has been updated to:', studyTargetLanguage);
    localStorage.setItem('studyTargetLanguage', studyTargetLanguage);
  }, [studyTargetLanguage]);

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    // ... Lógica del tema sin cambios
    return { isDarkMode: true, studyTimerEnabled: false, studyTimerDuration: 10, cardChangeSoundEnabled: true };
  });

  const toggleTheme = () => setTheme(prev => ({...prev, isDarkMode: !prev.isDarkMode}));
  const updateStudyTimerSettings = (enabled: boolean, duration: number) => setTheme(prev => ({...prev, studyTimerEnabled: enabled, studyTimerDuration: duration}));
  const updateCardChangeSound = (enabled: boolean) => setTheme(prev => ({...prev, cardChangeSoundEnabled: enabled}));

  const filteredFlashcards = useMemo(() => {
    let filtered = [...flashcards];
    if (activeCategory) {
      filtered = filtered.filter(card => card.categoryIds?.includes(activeCategory));
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(card =>
        (card.englishWord && card.englishWord.toLowerCase().includes(lowerSearchTerm)) ||
        (card.spanishTranslation && card.spanishTranslation.toLowerCase().includes(lowerSearchTerm)) ||
        (card.frenchTranslation && card.frenchTranslation.toLowerCase().includes(lowerSearchTerm))
      );
    }
    // ... add other filters if needed
    return filtered;
  }, [flashcards, activeCategory, searchTerm]);

  const getFlashcardById = (id: string) => flashcards.find(card => card.id === id);


  const contextValue: AppContextType = {
    flashcards,
    categories,
    activeCategory,
    searchTerm,
    sortOption,
    viewMode,
    theme,
    studyMode,
    studyTargetLanguage,
    isLoading,
    setFlashcards,
    setCategories,
    setActiveCategory,
    setSearchTerm,
    setSortOption,
    setViewMode,
    setStudyTargetLanguage,
    setStudyMode,
    toggleTheme,
    updateStudyTimerSettings,
    updateCardChangeSound,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    toggleFavorite,
    addCategory,
    updateCategory,
    deleteCategory,
    filteredFlashcards,
    getFlashcardById,
  };

  useEffect(() => {
    console.log('[AppContext] Provider re-rendered. Current language:', studyTargetLanguage);
  }, [studyTargetLanguage]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};