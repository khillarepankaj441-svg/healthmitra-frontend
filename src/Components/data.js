import { doctorPhotos } from './doctorPhotos'

export const services = [
  ['calendar', 'blue', 'Book Appointment', 'Book appointments with top doctors in your area.', 'Book Now'],
  ['records', 'green', 'Medical Records', 'Store and access your medical records securely.', 'View Records'],
  ['pill', 'orange', 'Medicine Reminder', 'Never miss your medicines with smart reminders.', 'Set Reminder'],
  ['sos', 'red', 'Emergency SOS', 'Get instant help in an emergency situation.', 'Get Help'],
  ['heart', 'purple', 'Health Calculator', 'Check your BMI and other health indicators.', 'Calculate Now'],
]

export const features = [
  ['calendar', 'Easy Appointment', 'Book appointments in just a few clicks.'],
  ['headset', '24/7 Support', 'We are here to help you anytime, anywhere.'],
  ['shield', 'Secure & Private', 'Your data is 100% secure and confidential.'],
  ['bell', 'Smart Reminders', 'Timely medicine and appointment alerts.'],
  ['user', 'Expert Doctors', 'Consult with experienced and verified doctors.'],
  ['chart', 'Health Insights', 'Track your health and get useful insights.'],
]

export const doctors = [
  ['Dr. Amit Verma', 'Cardiologist', '8+ Years Exp.', 'MBBS, MD', 'Max Super Speciality Hospital', '4.8', '120', doctorPhotos['Dr. Amit Verma']],
  ['Dr. Priya Sharma', 'Dermatologist', '7+ Years Exp.', 'MBBS, DDVL', 'Fortis Hospital, Delhi', '4.7', '98', doctorPhotos['Dr. Priya Sharma']],
  ['Dr. Rahul Mehta', 'Neurologist', '10+ Years Exp.', 'MBBS, DM', 'AIIMS Hospital, Delhi', '4.9', '150', doctorPhotos['Dr. Rahul Mehta']],
  ['Dr. Neha Singh', 'Pediatrician', '6+ Years Exp.', 'MBBS, DCH', 'Apollo Children Hospital', '4.6', '50', doctorPhotos['Dr. Neha Singh']],
  ['Dr. Vivek Jain', 'Orthopedic', '9+ Years Exp.', 'MBBS, MS', 'Medanta Hospital, Gurgaon', '4.8', '110', doctorPhotos['Dr. Vivek Jain']],
  ['Dr. Anjali Gupta', 'Gynecologist', '8+ Years Exp.', 'MBBS, MS', 'Cloudnine Hospital, Delhi', '4.7', '78', doctorPhotos['Dr. Anjali Gupta']],
  ['Dr. Saurabh Khanna', 'ENT Specialist', '7+ Years Exp.', 'MBBS, MS', 'BLK Max Hospital, Delhi', '4.6', '60', doctorPhotos['Dr. Saurabh Khanna']],
  ['Dr. Pooja Malhotra', 'Ophthalmologist', '6+ Years Exp.', 'MBBS, MS', 'Sankara Eye Hospital, Delhi', '4.5', '65', doctorPhotos['Dr. Pooja Malhotra']],
]

export const reviews = [
  ['Rohit Kumar', 'Bangalore', 'HealthMitra has made managing my health so easy. Booking appointments and reminders are super helpful!'],
  ['Anjali Mehta', 'Delhi', 'A very reliable platform for my family healthcare needs. Highly recommended!'],
  ['Vikas Sharma', 'Mumbai', 'The SOS feature is a lifesaver. Great app with amazing features!'],
]

export const articles = [
  ['Nutrition', '10 Superfoods to Boost Your Immunity Naturally', 'Include these superfoods in your diet to strengthen your immune system and stay healthy all year long.', 'May 15, 2024', '5 min read', 'food'],
  ['Fitness', 'Morning Exercises for a Healthy Body', 'Simple and effective morning exercises to boost your energy and keep you fit.', 'May 12, 2024', '6 min read', 'fitness'],
  ['Mental Health', 'How to Manage Stress and Stay Positive', 'Practical tips to manage stress, anxiety and maintain a positive mindset.', 'May 10, 2024', '4 min read', 'calm'],
  ['Diseases', "Early Signs of Diabetes You Shouldn't Ignore", 'Learn the early signs of diabetes and how you can manage it effectively.', 'May 15, 2024', '5 min read', 'diabetes'],
  ['Women Health', 'Essential Prenatal Care Tips for Healthy Pregnancy', 'Important prenatal care tips every woman should follow for a safe journey.', 'May 8, 2024', '6 min read', 'women'],
  ['Kids Health', 'Healthy Eating Habits for Growing Children', 'Best nutrition tips and healthy eating habits for your children growth.', 'May 3, 2024', '6 min read', 'kids'],
]

export const faqs = [
  ['How do I book an appointment with a doctor?', 'You can book an appointment by visiting the Doctors page, selecting your preferred doctor, date and time, and confirming your appointment. You will receive a confirmation via SMS and email.'],
  ['Is online consultation available?', 'Yes, online consultation is available with selected doctors through secure video calls.'],
  ['How can I upload my medical reports?', 'Open Medical Records, choose upload report, and add your files securely to your profile.'],
  ['What payment methods are accepted?', 'We accept UPI, cards, net banking and popular digital wallets.'],
  ['Can I cancel or reschedule my appointment?', 'Yes, appointments can be cancelled or rescheduled before the clinic cutoff time.'],
  ['How is my personal and medical information protected?', 'Your information is encrypted and handled with strict privacy controls.'],
  ['Do you offer 24/7 emergency support?', 'Yes, emergency SOS and support access is available around the clock.'],
]
