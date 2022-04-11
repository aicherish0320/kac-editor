import { mount, VueWrapper } from '@vue/test-utils'
import { message } from 'ant-design-vue'
import UserProfile from '@/components/UserProfile.vue'
import store from '@/store'

let wrapper: VueWrapper<any>
jest.mock('ant-design-vue', () => ({
  message: {
    success: jest.fn()
  }
}))
// jest.mock('vuex')
const mockedRoutes: string[] = []
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: (url: string) => mockedRoutes.push(url)
  })
}))

const mockComponent = {
  template: `<div><slot></slot></div>`
}

const mockComponent2 = {
  template: `<div><slot></slot><slot name="overlay"></slot></div>`
}
const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent,
  'router-link': mockComponent
}

describe('UserProfile component', () => {
  beforeAll(() => {
    jest.useFakeTimers()

    wrapper = mount(UserProfile, {
      props: {
        user: { isLogin: false }
      },
      global: {
        components: globalComponents,
        provide: { store }
      }
    })
  })
  it('should render login when login is false', async () => {
    expect(wrapper.get('.user-profile-component').text()).toBe('登录')
    await wrapper.get('.user-profile-component').trigger('click')
    expect(message.success).toHaveBeenCalled()
    expect(store.state.user.data.nickName).toBe('aicherish')
  })
  it('should render nickName when login is true', async () => {
    await wrapper.setProps({
      user: {
        isLogin: true,
        data: {
          nickName: 'aicherish'
        }
      }
    })
    expect(wrapper.get('.user-profile-component').html()).toContain('aicherish')
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy()
  })
  it('should call logout and show message, call router.push after timeout', async () => {
    await wrapper.get('#logout').trigger('click')
    expect(store.state.user.isLogin).toBeFalsy()
    expect(message.success).toHaveBeenCalledTimes(1)
    jest.runAllTimers()
    expect(mockedRoutes).toEqual(['/'])
  })
  afterEach(() => {
    ;(message as jest.Mocked<typeof message>).success.mockReset()
  })
})
