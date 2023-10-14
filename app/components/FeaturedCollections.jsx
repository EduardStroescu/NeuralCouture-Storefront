import {Image} from '@shopify/hydrogen';
import {Heading, Section, Grid, Link} from '~/components';

export function FeaturedCollections({
  collections,
  title = 'Collections',
  ...props
}) {
  const haveCollections = collections?.nodes?.length > 0;
  if (!haveCollections) return null;

  const collectionsWithImage = collections.nodes.filter((item) => item.image);

  return (
    <Section padding="x" {...props} heading={title}>
      <Grid items={collectionsWithImage.length}>
        {collectionsWithImage.map((collection) => {
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`}>
              <div className="grid gap-4">
                <div className="card-image bg-primary/5 aspect-[4/3]">
                  {collection?.image && (
                    <Image
                      className="object-fill rounded"
                      aspectRatio={'4/3'}
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                      sizes="(max-width: 32em) 100vw, 33vw"
                    />
                  )}
                </div>
                <Heading className="lg:" size="copy">
                  {collection.title}
                </Heading>
              </div>
            </Link>
          );
        })}
      </Grid>
    </Section>
  );
}
