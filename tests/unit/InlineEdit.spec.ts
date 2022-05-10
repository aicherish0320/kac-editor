import { mount, VueWrapper } from '@vue/test-utils'
import InlineEdit from '@/components/InlineEdit.vue'
import { nextTick } from 'vue'

let wrapper: VueWrapper<any>

describe('InputEdit component', () => {
  beforeAll(() => {
    wrapper = mount(InlineEdit, {
      props: {
        value: 'test'
      }
    })
  })
  it('should render the default layout', () => {
    expect(wrapper.get('span').text()).toBe('test')
  })
  it('should render input when clicking the element', async () => {
    await wrapper.trigger('click')
    expect(wrapper.find('input').exists()).toBeTruthy()
    const input = wrapper.get('input').element as HTMLInputElement
    expect(input.value).toBe('test')
  })
  it('press enter should render to default layout with new value', async () => {
    await wrapper.get('input').setValue('testNew')
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.find('span').exists()).toBeTruthy()
    expect(wrapper.get('span').text()).toBe('testNew')
    const events = wrapper.emitted('change')
    if (events) {
      expect(events[0]).toEqual(['testNew'])
    }
  })
  it('press esc should render to default layout with old value', async () => {
    await wrapper.trigger('click')
    await wrapper.get('input').setValue('test123')
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    await nextTick()
    expect(wrapper.find('span').exists()).toBeTruthy()
    expect(wrapper.get('span').text()).toBe('testNew')
  })
  // it('click outside should render to default layout with new value', () => {})
})
