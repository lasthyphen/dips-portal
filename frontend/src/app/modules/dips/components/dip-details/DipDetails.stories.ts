import { Story, Meta } from '@storybook/angular/types-6-0';
import { DipDetailsComponent } from './dip-details.component';
import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';
import { StatusComponent } from '../status/status.component';

export default {
  title: 'DEVELOP/Components/Dip Details',
  component: DipDetailsComponent,
  decorators: [
    moduleMetadata({
      declarations: [StatusComponent, DipDetailsComponent],
      imports: [CommonModule],
    }),
  ],
} as Meta;

const Template: Story<DipDetailsComponent> = (args: DipDetailsComponent) => ({
  component: DipDetailsComponent,
  props: args,
});

export const Default = Template.bind({});







