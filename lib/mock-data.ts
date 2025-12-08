import { type User, type Batchmate, ENGINEERING_FIELDS, COUNTRIES } from "./types"

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "superadmin@alumni.edu",
    username: "superadmin",
    role: "super_admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "admin2@alumni.edu",
    username: "superadmin2",
    role: "super_admin",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    email: "admin3@alumni.edu",
    username: "superadmin3",
    role: "super_admin",
    createdAt: "2024-01-03T00:00:00Z",
  },
  ...ENGINEERING_FIELDS.map((field, index) => ({
    id: `field-admin-${index + 1}`,
    email: `${field.toLowerCase()}admin@alumni.edu`,
    username: `${field.toLowerCase()}admin`,
    role: "field_admin" as const,
    assignedField: field,
    createdAt: "2024-01-15T00:00:00Z",
  })),
]

// Generate mock batchmates
const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Sarah",
  "David",
  "Emma",
  "Robert",
  "Lisa",
  "William",
  "Emily",
  "James",
  "Anna",
  "Daniel",
  "Maria",
  "Andrew",
  "Sofia",
  "Thomas",
  "Laura",
  "Christopher",
  "Jessica",
]
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
]
const nickNames = [
  "Johnny",
  "Jay",
  "Mike",
  "Sam",
  "Dave",
  "Em",
  "Rob",
  "Liz",
  "Will",
  "Emmy",
  "Jim",
  "Annie",
  "Dan",
  "Mia",
  "Andy",
  "Soph",
  "Tom",
  "Laurie",
  "Chris",
  "Jess",
]
const workplaces = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Tesla",
  "IBM",
  "Intel",
  "Oracle",
  "Cisco",
  "Samsung",
  "Sony",
  "Dell",
  "HP",
  "Adobe",
  "Salesforce",
  "Netflix",
  "Uber",
  "Airbnb",
  "SpaceX",
]

export const mockBatchmates: Batchmate[] = []

ENGINEERING_FIELDS.forEach((field, fieldIndex) => {
  for (let i = 0; i < 15; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const nickName = nickNames[Math.floor(Math.random() * nickNames.length)]
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
    const workplace = workplaces[Math.floor(Math.random() * workplaces.length)]

    mockBatchmates.push({
      id: `batchmate-${fieldIndex}-${i}`,
      callingName: firstName,
      fullName: `${firstName} ${lastName}`,
      whatsappMobile: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      nickName: Math.random() > 0.3 ? nickName : undefined,
      address: Math.random() > 0.4 ? `${Math.floor(100 + Math.random() * 9900)} Main Street, City` : undefined,
      country,
      workingPlace: Math.random() > 0.2 ? workplace : undefined,
      mobile: Math.random() > 0.5 ? `+1${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined,
      universityPhoto:
        Math.random() > 0.6
          ? `/placeholder.svg?height=200&width=200&query=university graduation photo ${firstName}`
          : undefined,
      currentPhoto:
        Math.random() > 0.4
          ? `/placeholder.svg?height=200&width=200&query=professional headshot ${firstName}`
          : undefined,
      field,
      createdAt: new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        Math.floor(1 + Math.random() * 28),
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
})
