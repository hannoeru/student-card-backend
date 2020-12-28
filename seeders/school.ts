import { prisma } from '../src/prisma'

const addSchool = async() => {
  const school = await prisma.school.create({
    data: {
      name: '東京デザインテクノロジーセンター専門学校',
      code: 'techc',
      address: '〒169-0075 東京都新宿区高田馬場2-11-10',
      phone: '0120-00-5586',
      logo: 'https://www.tech.ac.jp/assets/img/footer/logo.png',
      headOfSchool: '多田 順次',
    },
  })

  console.log(school)
}

addSchool()
