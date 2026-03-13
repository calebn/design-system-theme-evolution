import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';

type Brand = 'logos' | 'verbum';

interface ComponentStripProps {
  brand: Brand;
}

export function ComponentStrip({ brand }: ComponentStripProps) {
  return (
    <div
      data-brand={brand}
      style={{
        backgroundColor: 'var(--color-surface, #fff)',
        borderRadius: 12,
        padding: 24,
        border: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Card title="Buttons" description="Primary, secondary, and ghost variants.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            <Button variant="primary">Buy now</Button>
            <Button variant="secondary">Details</Button>
            <Button variant="ghost">Dismiss</Button>
          </div>
        </Card>

        <Card title="Badges" description="Semantic role-based color tokens.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Limited</Badge>
            <Badge variant="danger">Sold Out</Badge>
          </div>
        </Card>

        <Card title="Elevated Card" description="Shadow and surface tokens." elevated>
          <Button size="sm" variant="secondary">
            View details
          </Button>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Alert variant="success" title="Payment confirmed">
          Your subscription is active. Welcome!
        </Alert>
        <Alert variant="warning" title="Limited availability">
          Only 3 copies remain at this price.
        </Alert>
        <Alert variant="danger" title="Card declined">
          Please check your details and try again.
        </Alert>
      </div>
    </div>
  );
}
