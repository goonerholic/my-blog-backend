import Post from '../models/post';

export default async function createFakeData(count: number) {
  const posts = [...Array(count).keys()].map((i) => ({
    title: `포스트 #${i}`,
    body: `sdfdfsdfef sef swetre rt rt  adfs dfsf 
        sdf sdfsfewfsdf sdf wef wefwef wefw ef 5yhtrg
        sdfgthte teh thyruhj65htg gh   htethyeth thtd
        g eghtrhetr reg eryget t hr hteh teh reg ergh`,
    tags: ['fake', 'data'],
  }));
  try {
    await Post.insertMany(posts);
  } catch (e) {
    return {
      where: 'createFakeDate.ts',
      message: e.message,
    };
  }
}
