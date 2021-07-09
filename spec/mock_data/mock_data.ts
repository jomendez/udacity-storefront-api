export const mockedUserObjectOne = {
  userName: 'userOne',
  firstName: 'Jane',
  lastName: 'Smith',
  password: 'pass321'
}

export const mockedUserObjectTwo = {
  userName: 'userTwo',
  firstName: 'Jhon',
  lastName: 'Doe',
  password: 'pass123'
}


export const mockedProductObjectOne = {
  name: 'playStation',
  price: 219.99,
  category: 'Gaming'
}

export const mockedProductObjectTwo = {
  name: 'Apple',
  price: 8.99,
  category: 'Fruit'
}

export interface IProductAssert {
  id?: number,
  name: string,
  price: string,
  category: string
}