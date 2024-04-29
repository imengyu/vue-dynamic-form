<template>

  <Tabs v-model:activeKey="activeKey" centered>
    <TabPane key="1" tab="Ant Desgin Vue">
      <IngrateDemoAntDesgin />
      <VueCodeHighlighter :code="codeAntDesginVue" lang="ts" title="ts" />
    </TabPane>
    <TabPane key="2" tab="Arco Desgin Vue">
      <IngrateDemoArcoDesgin />
      <VueCodeHighlighter :code="codeArcoDesginVue" lang="ts" title="ts" />
    </TabPane>
    <TabPane key="3" tab="Element Plus">
      <IngrateDemoElementPlus />
      <VueCodeHighlighter :code="codeElementPlus" lang="ts" title="ts" />
    </TabPane>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabPane } from 'ant-design-vue'
import { ref } from 'vue';
import IngrateDemoArcoDesgin from './IngrateDemoArcoDesgin.vue';
import IngrateDemoAntDesgin from './IngrateDemoAntDesgin.vue';
import { VueCodeHighlighter } from 'vue-code-highlighter'
import codeAntDesginVue from './AntDesgin?raw'
import codeArcoDesginVue from './AntDesgin?raw'
import codeElementPlus from './ElementPlus?raw'
import IngrateDemoElementPlus from './IngrateDemoElementPlus.vue';

const activeKey = ref('1');
</script>