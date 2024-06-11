import { Test, TestingModule } from '@nestjs/testing';
import { PanelGateway } from './panel.gateway';

describe('PanelGateway', () => {
  let gateway: PanelGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelGateway],
    }).compile();

    gateway = module.get<PanelGateway>(PanelGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
