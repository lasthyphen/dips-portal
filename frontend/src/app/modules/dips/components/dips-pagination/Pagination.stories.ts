import { Story, Meta } from '@storybook/angular/types-6-0';
import { DipsPaginationComponent } from './dips-pagination.component';

export default {
  title: 'DEVELOP/Components/Pagination',
  component: DipsPaginationComponent,
} as Meta;

const Template: Story<DipsPaginationComponent> = (args: DipsPaginationComponent) => ({
  component: DipsPaginationComponent,
  props: args,
});

export const Default = Template.bind({});

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/EuDxD9e2oviaYGAQwryP9q/Web?node-id=41%3A343'
 }
};





