<script lang="ts">
import { defineComponent, h, type PropType, type VNode } from 'vue'

export default defineComponent({
  name: 'VNodeRenderer',
  props: {
    vnode: {
      type: Object as PropType<VNode>,
      default: null
    },
    render: {
      type: Function as PropType<(data: Record<string, unknown>|null) => VNode>,
      default: null
    },
    renderChild: {
      type: Boolean,
      default: null
    },
    data: {
      type: Object as PropType<Record<string, unknown>>,
      default: null
    },
  },
  render() {
    if(this.vnode) {
      if (typeof this.vnode === 'string')
        return h('div', this.vnode);
      const props = this.vnode.props;
      if(props)
        for(let key in this.data)
          props[key] = this.data[key];
      return this.renderChild ? 
        h('div', { style: { height: '100%'} }, [
          this.vnode
        ]) : 
        this.vnode;
    }
    if(this.render) {
      return this.render(this.data);
    }
    return h('div');
  }
})
</script>