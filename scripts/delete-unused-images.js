import fs from 'fs';
import path from 'path';

const IMAGES_DIR = 'public/images/flashcards';

// Lista de imágenes no utilizadas (extraída del análisis anterior)
const unusedImages = [
  'horse.jpg', 'hospital.jpg', 'hotel.jpg', 'hour.jpg', 'house.jpg', 
  'hydroelectric dam.jpg', 'ice cream truck.jpg', 'ice-cream.jpg', 
  'interview.jpg', 'invitation.jpg', 'invoice.jpg', 'january.jpg', 
  'jet ski.jpg', 'job.jpg', 'judge.jpg', 'july.jpg', 'june.jpg', 
  'kayak.jpg', 'key.jpg', 'kitchen.jpg', 'knife.jpg', 'lamp.jpg', 
  'lantern.jpg', 'laptop.jpg', 'lawyer.jpg', 'leader.jpg', 'leaf.jpg', 
  'librarian.jpg', 'library.jpg', 'life jacket.jpg', 'light.jpg', 
  'lighthouse.jpg', 'local bus.jpg', 'lonely.jpg', 'loud.jpg', 
  'luggage.jpg', 'mail truck.jpg', 'map.jpg', 'march.jpg', 'marina.jpg', 
  'market.jpg', 'mast.jpg', 'may.jpg', 'mechanic.jpg', 'medicine.jpg', 
  'meeting.jpg', 'menu.jpg', 'message.jpg', 'milk.jpg', 'minibus.jpg', 
  'minute.jpg', 'mirror.jpg', 'money.jpg', 'monorail.jpg', 'moon.jpg', 
  'mooring.jpg', 'morning.jpg', 'motorcycle.jpg', 'mountain.jpg', 
  'moving truck.jpg', 'museum.jpg', 'musician.jpg', 'napkin.jpg', 
  'neighbor.jpg', 'nephew.jpg', 'nervous.jpg', 'niece.jpg', 'night.jpg', 
  'noise.jpg', 'notebook.jpg', 'november.jpg', 'nuclear power plant.jpg', 
  'nurse.jpg', 'october.jpg', 'office.jpg', 'orange.jpg', 'organizer.jpg', 
  'paddleboard.jpg', 'painter.jpg', 'painting.jpg', 'pan.jpg', 'paper.jpg', 
  'partner.jpg', 'passenger.jpg', 'passport.jpg', 'password.jpg', 
  'pen.jpg', 'pencil.jpg', 'phone.jpg', 'phonecall.jpg', 'photographer.jpg', 
  'picture.jpg', 'pier.jpg', 'pilot.jpg', 'pizza.jpg', 'plant.jpg', 
  'plate.jpg', 'plumber.jpg', 'police car.jpg', 'police officer.jpg', 
  'police station.jpg', 'police.jpg', 'port.jpg', 'post office.jpg', 
  'power lines.jpg', 'printer.jpg', 'propeller.jpg', 'proud.jpg', 
  'puzzle.jpg', 'quiet.jpg', 'rabbit.jpg', 'raft.jpg', 'rain.jpg', 
  'raincoat.jpg', 'receipt.jpg', 'receptionist.jpg', 'remote.jpg', 
  'rent.jpg', 'schoolbag.jpg', 'scientist.jpg', 'scuba gear.jpg', 
  'second.jpg', 'security.jpg', 'september.jpg', 'shadow.jpg', 
  'shirt.jpg', 'shoes.jpg', 'shuttle bus.jpg', 'shy.jpg', 'snow.jpg', 
  'soap.jpg', 'sofa.jpg', 'solar panel.jpg', 'speedboat.jpg', 'spoon.jpg', 
  'spring.jpg', 'stage.jpg', 'stairs.jpg', 'star.jpg', 'stranger.jpg', 
  'street.jpg', 'subway.jpg', 'suitcase.jpg', 'summer.jpg', 'sun.jpg', 
  'surfboard.jpg', 'surprised.jpg', 'table.jpg', 'taxi.jpg', 'team.jpg', 
  'teenager.jpg', 'television.jpg', 'temperature.jpg', 'text-message.jpg', 
  'tired.jpg', 'today.jpg', 'tomorrow.jpg', 'toothbrush.jpg', 'toothpaste.jpg', 
  'tour bus.jpg', 'tour.jpg', 'tourist.jpg', 'traffic.jpg', 'train station.jpg', 
  'train.jpg', 'transformer.jpg', 'tree.jpg', 'truck.jpg', 'tshirt.jpg', 
  'uncle.jpg', 'uniform.jpg', 'van.jpg', 'verb-come.jpg', 'verb-do.jpg', 
  'verb-drink.jpg', 'verb-eat.jpg', 'verb-find.jpg', 'verb-get.jpg', 
  'verb-give.jpg', 'verb-go.jpg', 'verb-have.jpg', 'verb-hear.jpg', 
  'verb-know.jpg', 'verb-listen.jpg', 'verb-look.jpg', 'verb-make.jpg', 
  'verb-need.jpg', 'verb-play.jpg', 'verb-read.jpg', 'verb-run.jpg', 
  'verb-say.jpg', 'verb-see.jpg', 'verb-sleep.jpg', 'verb-speak.jpg', 
  'verb-study.jpg', 'verb-swim.jpg', 'verb-take.jpg', 'verb-think.jpg', 
  'verb-walk.jpg', 'verb-want.jpg', 'verb-work.jpg', 'verb-write.jpg', 
  'visit.jpg', 'volunteer.jpg', 'waiter.jpg', 'wall.jpg', 'wallet.jpg', 
  'watch.jpg', 'water skis.jpg', 'water.jpg', 'week.jpg', 'wharf.jpg', 
  'wind turbine.jpg', 'window.jpg', 'windowpane.jpg', 'winter.jpg', 
  'witness.jpg', 'yesterday.jpg'
];

async function deleteUnusedImages() {
  console.log('🗑️  Iniciando eliminación de imágenes no utilizadas...');
  console.log(`📊 Total de imágenes a eliminar: ${unusedImages.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  const failedDeletions = [];

  for (const imageFile of unusedImages) {
    const imagePath = path.join(IMAGES_DIR, imageFile);
    
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`✅ Eliminado: ${imageFile}`);
        successCount++;
      } else {
        console.log(`⚠️  No encontrado: ${imageFile}`);
      }
    } catch (error) {
      console.log(`❌ Error eliminando ${imageFile}: ${error.message}`);
      errorCount++;
      failedDeletions.push(imageFile);
    }
  }
  
  console.log('\n📊 Resumen de eliminación:');
  console.log(`✅ Imágenes eliminadas exitosamente: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  
  if (failedDeletions.length > 0) {
    console.log('\n📋 Imágenes que no se pudieron eliminar:');
    failedDeletions.forEach(image => console.log(`   - ${image}`));
  }
  
  // Verificar el resultado final
  const remainingImages = fs.readdirSync(IMAGES_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
  
  console.log(`\n📊 Imágenes restantes en carpeta: ${remainingImages.length}`);
  console.log('🎯 Ahora deberías tener exactamente 300 imágenes (una por cada flashcard)');
}

// Ejecutar el script
deleteUnusedImages(); 