import 'reflect-metadata'
require('jsdom-global')()
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import * as chai from 'chai'
import * as chaiEnzyme from 'chai-enzyme'
import * as sinonChai from 'sinon-chai'

chai.use(chaiEnzyme())
chai.use(sinonChai)
