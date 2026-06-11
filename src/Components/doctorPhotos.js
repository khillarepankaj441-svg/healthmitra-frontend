import amitPhoto from '../assets/doctors/amit.jpg'
import anjaliPhoto from '../assets/doctors/anjali.jpg'
import nehaPhoto from '../assets/doctors/neha.jpg'
import poojaPhoto from '../assets/doctors/pooja.jpg'
import priyaPhoto from '../assets/doctors/priya.jpg'
import rahulPhoto from '../assets/doctors/rahul.jpg'
import saurabhPhoto from '../assets/doctors/saurabh.jpg'
import vivekPhoto from '../assets/doctors/vivek.jpg'

export const doctorPhotos = {
  'doc-amit': amitPhoto,
  'doc-priya': priyaPhoto,
  'doc-rahul': rahulPhoto,
  'doc-neha': nehaPhoto,
  'doc-vivek': vivekPhoto,
  'doc-anjali': anjaliPhoto,
  'doc-saurabh': saurabhPhoto,
  'doc-pooja': poojaPhoto,
  'Dr. Amit Verma': amitPhoto,
  'Dr. Priya Sharma': priyaPhoto,
  'Dr. Rahul Mehta': rahulPhoto,
  'Dr. Neha Singh': nehaPhoto,
  'Dr. Vivek Jain': vivekPhoto,
  'Dr. Anjali Gupta': anjaliPhoto,
  'Dr. Saurabh Khanna': saurabhPhoto,
  'Dr. Pooja Malhotra': poojaPhoto,
  'Rohit Sharma': rahulPhoto,
  'Anjali Verma': anjaliPhoto,
  'Amit Patel': amitPhoto,
  'Neha Singh': nehaPhoto,
  'Admin User': saurabhPhoto,
  Patient: priyaPhoto,
  'Login Doctor': vivekPhoto,
  'Signup Doctor': anjaliPhoto,
  'Need Help': poojaPhoto,
}

const photoPool = [amitPhoto, priyaPhoto, rahulPhoto, nehaPhoto, vivekPhoto, anjaliPhoto, saurabhPhoto, poojaPhoto]

function photoFromText(text = '') {
  const value = String(text)
  const total = [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return photoPool[total % photoPool.length]
}

export function getDoctorPhoto(doctor) {
  const id = doctor?.id
  const name = doctor?.name || doctor?.[0]
  return doctorPhotos[id] || doctorPhotos[name] || doctor?.photo || doctor?.[7] || photoFromText(name || id || 'Doctor')
}
