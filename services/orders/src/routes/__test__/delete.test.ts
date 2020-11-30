import request from 'supertest'

import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket, Order, OrderStatus } from '../../models'
import { fakeId } from '../../lib'

it.todo('delete one order')
